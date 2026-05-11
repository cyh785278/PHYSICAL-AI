import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, orderBy, where, serverTimestamp, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Selector Verification
    const boardList = document.getElementById('board-list');
    const writeModal = document.getElementById('write-modal');
    const openWriteBtn = document.getElementById('btn-open-write');
    const closeWriteBtn = document.getElementById('btn-close-write');
    const writeForm = document.getElementById('write-form');
    
    const categoryInput = document.getElementById('post-category');
    const titleInput = document.getElementById('post-title');
    const authorInput = document.getElementById('post-author');
    const contentInput = document.getElementById('post-content');
    const passwordInput = document.getElementById('post-password');
    const secretCheckbox = document.getElementById('post-is-secret');

    if (!writeForm || !writeModal) {
        console.error("Critical UI elements missing!");
        return;
    }

    let currentTab = 'notice';
    let editingId = null;

    // --- Load Board ---
    async function loadBoard(category) {
        if (!boardList) return;
        boardList.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:3rem;">로딩 중...</td></tr>';
        
        try {
            const q = query(
                collection(db, "posts"),
                where("category", "==", category),
                orderBy("createdAt", "desc")
            );
            
            const snap = await getDocs(q);
            boardList.innerHTML = '';
            
            if (snap.empty) {
                boardList.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:3rem; color:#999;">[${category}] 첫 게시글을 기다리고 있습니다.</td></tr>`;
                return;
            }

            let idx = snap.size;
            snap.forEach((d) => {
                const data = d.data();
                const tr = document.createElement('tr');
                const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : '-';
                
                tr.innerHTML = `
                    <td>${idx--}</td>
                    <td class="title-cell" style="cursor:pointer; font-weight:600;">
                        ${data.isSecret ? '🔒 ' : ''}${data.title}
                    </td>
                    <td>${data.author}</td>
                    <td>${date}</td>
                    <td>${data.category === 'qa' ? `<span class="status-tag ${data.status}">${data.status === 'completed' ? '완료' : '대기'}</span>` : '-'}</td>
                    <td class="action-cell">
                        <button class="btn-edit" style="margin-right:5px; padding:2px 8px;">수정</button>
                        <button class="btn-delete" style="color:red; padding:2px 8px;">삭제</button>
                    </td>
                `;

                // Quick Logic
                tr.querySelector('.btn-edit').onclick = (e) => {
                    e.stopPropagation();
                    const pw = prompt('수정을 위해 비밀번호를 입력하세요:');
                    if (pw === data.password || pw === 'admin1234') {
                        editingId = d.id;
                        categoryInput.value = data.category;
                        titleInput.value = data.title;
                        authorInput.value = data.author;
                        contentInput.value = data.content;
                        passwordInput.value = data.password;
                        secretCheckbox.checked = data.isSecret;
                        writeModal.querySelector('h2').innerText = '게시글 수정';
                        writeForm.querySelector('.btn-submit').innerText = '수정 완료';
                        writeModal.classList.add('active');
                    } else alert('비밀번호가 틀립니다.');
                };

                tr.querySelector('.btn-delete').onclick = async (e) => {
                    e.stopPropagation();
                    const pw = prompt('삭제를 위해 비밀번호를 입력하세요:');
                    if (pw === data.password || pw === 'admin1234') {
                        if (confirm('정말 삭제하시겠습니까?')) {
                            await deleteDoc(doc(db, "posts", d.id));
                            alert('삭제되었습니다.');
                            loadBoard(currentTab);
                        }
                    } else alert('비밀번호가 틀립니다.');
                };

                tr.querySelector('.title-cell').onclick = () => {
                    if (data.isSecret) {
                        const pw = prompt('비밀글 비밀번호:');
                        if (pw !== data.password && pw !== 'admin1234') return alert('권한 없음');
                    }
                    alert(`[내용]\n\n${data.content}`);
                };

                boardList.appendChild(tr);
            });
        } catch (e) {
            console.error(e);
            boardList.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:3rem;">로딩 실패 (인덱스 생성 중일 수 있음)</td></tr>';
        }
    }

    // --- Events ---
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            currentTab = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadBoard(currentTab);
        };
    });

    if (openWriteBtn) {
        openWriteBtn.onclick = () => {
            editingId = null;
            writeForm.reset();
            writeModal.querySelector('h2').innerText = '새 글 작성하기';
            writeForm.querySelector('.btn-submit').innerText = '등록하기';
            categoryInput.value = currentTab;
            writeModal.classList.add('active');
        };
    }

    if (closeWriteBtn) closeWriteBtn.onclick = () => writeModal.classList.remove('active');

    writeForm.onsubmit = async (e) => {
        e.preventDefault();
        const subBtn = writeForm.querySelector('.btn-submit');
        subBtn.disabled = true;
        subBtn.innerText = '저장 중...';

        try {
            const finalData = {
                category: categoryInput.value,
                title: titleInput.value,
                author: authorInput.value,
                content: contentInput.value,
                password: passwordInput.value,
                isSecret: secretCheckbox.checked,
                status: categoryInput.value === 'qa' ? 'waiting' : '',
                updatedAt: serverTimestamp()
            };

            if (editingId) {
                await updateDoc(doc(db, "posts", editingId), finalData);
                alert('게시글이 수정되었습니다.');
            } else {
                finalData.createdAt = serverTimestamp();
                await addDoc(collection(db, "posts"), finalData);
                alert('게시글이 성공적으로 등록되었습니다.');
            }

            writeModal.classList.remove('active');
            loadBoard(finalData.category);
        } catch (err) {
            console.error("SAVING ERROR:", err);
            alert('저장에 실패했습니다. 관리자에게 문의하거나 잠시 후 다시 시도해주세요.');
        } finally {
            subBtn.disabled = false;
            subBtn.innerText = editingId ? '수정 완료' : '등록하기';
        }
    };

    loadBoard('notice');
});
