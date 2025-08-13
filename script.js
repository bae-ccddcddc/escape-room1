document.addEventListener('DOMContentLoaded', () => {

    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const puzzleTitle = document.getElementById('puzzle-title');
    const puzzleQuestion = document.getElementById('puzzle-question');
    const puzzleAnswer = document.getElementById('puzzle-answer');
    const puzzleSubmit = document.getElementById('puzzle-submit');
    const feedback = document.getElementById('feedback');
    const inventorySlots = document.getElementById('inventory-slots');
    const noteArea = document.getElementById('note');

    let currentPuzzleId = null;
    const solvedPuzzles = new Set();
    const foundDigits = {};

    // 퍼즐 데이터: 각 퍼즐의 논리를 더 명확하게 수정
    const puzzles = {
        globe: {
            title: "지구본",
            question: "이 교실에 놓여있는 지구본은 총 몇 개인가요?",
            answer: "1",
            digit: "1" 
        },
        chalkboard: {
            title: "칠판",
            question: "칠판의 왼편에는 여러 도형이 그려져 있습니다. 삼각형과 오각형의 꼭짓점 개수를 모두 더하면 얼마일까요?",
            answer: "8",
            digit: "8"
        },
        clock: {
            title: "디지털 시계",
            question: "디지털 시계는 '4:55'를 가리킵니다. 이 세 숫자를 모두 더한 값(4+5+5)의 각 자릿수를 다시 더하면(예: 합이 19 → 1+9) 최종 값은 무엇일까요?",
            answer: "5",
            digit: "5"
        },
        chest: {
            title: "나무 상자",
            question: "이 오래된 나무 상자는 텅 비어있습니다. 상자 안에 들어있는 물건의 개수는?",
            answer: "0",
            digit: "0"
        },
        note: {
            title: "의문의 쪽지",
            question: "쪽지에는 이렇게 쓰여있다:\n'숫자들은 이 교실이 기억하는 우리나라의 의미있는 날을 가리킨다.'\n획득한 숫자들로 만들 수 있는 역사적인 날짜 4자리는 무엇일까요?",
            answer: "0815"
        },
        door: {
            title: "탈출구",
            question: "문을 열기 위한 4자리 비밀번호를 입력하세요.",
            answer: "0815"
        }
    };

    // 클릭 가능한 모든 영역에 이벤트 리스너 추가
    document.querySelectorAll('.clickable-area').forEach(area => {
        area.addEventListener('click', () => handleAreaClick(area.id));
    });

    // --- 함수 정의 ---

    function handleAreaClick(id) {
        // 이미 푼 문제 클릭 시
        if (id !== 'door' && solvedPuzzles.has(id)) {
            alert('이미 해결한 단서입니다.');
            return;
        }

        // '쪽지'는 4개의 숫자를 모두 모아야 활성화
        if (id === 'note' && Object.keys(foundDigits).length < 4) {
            alert('아직은 읽을 수 없는 것 같다. 다른 단서들을 먼저 찾아보자.');
            return;
        }

        // '문'은 최종 비밀번호를 입력하는 곳
        if (id === 'door' && Object.keys(foundDigits).length < 4) {
            alert('비밀번호를 알아내기 전에는 열 수 없다. 교실을 더 조사해보자.');
            return;
        }

        currentPuzzleId = id;
        openModal(puzzles[id]);
    }

    function openModal(puzzle) {
        puzzleTitle.textContent = puzzle.title;
        puzzleQuestion.innerHTML = puzzle.question.replace(/\n/g, '<br>'); // 줄바꿈 처리
        feedback.textContent = '';
        puzzleAnswer.value = '';
        modal.classList.add('is-visible');
        puzzleAnswer.focus();
    }

    function closeModal() {
        modal.classList.remove('is-visible');
    }

    function handleSubmit() {
        const userAnswer = puzzleAnswer.value.trim();
        const puzzle = puzzles[currentPuzzleId];

        if (userAnswer.toLowerCase() === puzzle.answer.toLowerCase()) {
            feedback.textContent = '정답입니다!';
            feedback.className = 'feedback-correct';

            if (currentPuzzleId === 'door' || currentPuzzleId === 'note') {
                setTimeout(() => {
                    alert('철컥! 문이 열렸습니다. 축하합니다! 교실을 탈출했습니다!');
                    closeModal();
                }, 800);
            } else {
                solvedPuzzles.add(currentPuzzleId);
                foundDigits[currentPuzzleId] = puzzle.digit;
                updateInventory();
                
                const solvedArea = document.getElementById(currentPuzzleId);
                if(solvedArea) {
                    solvedArea.style.border = '2px solid #28a745';
                    solvedArea.title = '해결 완료';
                }
                setTimeout(closeModal, 1200);
            }
        } else {
            feedback.textContent = '틀렸습니다. 다시 생각해보세요.';
            feedback.className = 'feedback-incorrect';
        }
    }

    function updateInventory() {
        // 인벤토리 숫자 업데이트 (순서 섞어서 보여주기)
        const digits = Object.values(foundDigits).sort();
        inventorySlots.textContent = digits.join('  ');

        // 4개의 숫자를 모두 찾았을 때 쪽지 활성화
        if (Object.keys(foundDigits).length === 4) {
             setTimeout(()=> {
                alert("모든 숫자 조각을 찾았다!\n\n...그러자 앞쪽 책상 위에 이전에는 보이지 않던 [쪽지]가 나타났다!");
                noteArea.style.display = 'block'; // 쪽지 표시
            }, 1300);
        }
    }

    // 모달 닫기 버튼, 엔터키, 제출 버튼 이벤트
    modalClose.addEventListener('click', closeModal);
    puzzleSubmit.addEventListener('click', handleSubmit);
    puzzleAnswer.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    });
});