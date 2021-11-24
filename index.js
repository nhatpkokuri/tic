//DOMの読み込みが完了したときに処理を実行する
//Ecma es6
//()=>{} アロー関数
window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));//格子リスト
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;

    const PLAYERX_WON = 'PLAYERX_WON';//Xが勝ちます
    const PLAYERO_WON = 'PLAYERO_WON';//Yがかちます
    const TIE = 'TIE';//引き分け
    //勝利条件
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    //勝利検証を処理する
    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            //チェック処理
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }
    //勝ったひとが出たらお知らせ
    if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }
    //勝ったひとが出ない、さらに入力場所もない→引き分けになります。
    if (!board.includes(''))//入力場所まだあるかどうか判定します。
        announce(TIE);
    }
    //お知らせ処理
    const announce = (type) => {
        switch(type){
            case PLAYERO_WON:
                announcer.innerHTML = 'プレーヤー<span class="playerO">O</span>勝った。';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'プレーヤー<span class="playerX">X</span>勝った。';
                break;
            case TIE:
                announcer.innerText = '引き分けだ。';
        }
        announcer.classList.remove('hide');
    };
    //格子
    const updateBoard =  (index) => {
        board[index] = currentPlayer;
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }
    //有効なアクション
    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O'){
            return false;
        }

        return true;
    };

    const userAction = (tile, index) => {
        if(isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }
    //ゲームリセット
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }
    //ゲーム実行
    tiles.forEach( (tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
});