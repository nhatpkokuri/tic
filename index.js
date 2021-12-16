//DOMの読み込みが完了したときに処理を実行する
//Ecma es7規格
//()=>{} アロー関数->巻き上げるletとconst使う限り不可能
//三項演算子
//bodyタグの最後にスクリプトがある理由
//スクリプトはページのレンダリングをブロックしていません。
//また、DOM操作に必要なDOMがすでに存在していることを確認します。
//elem.classList.contains(“class”) -> 対象の要素にクラス名が含まれていれば「true」、含まれていなければ「false」が返ります
window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));//似た格子➞配列を作る
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');//アナウンサー
    let board = ['', '', '', '', '', '', '', '', ''];//ボード
    let currentPlayer = 'X';//初期化プレイヤー
    let isGameActive = true;//ゲームアクティブ

    const PLAYERX_WON = 'PLAYERX_WON';//Xが勝つ
    const PLAYERO_WON = 'PLAYERO_WON';//Yが勝つ
    const TIE = 'TIE';//引き分け
    /*
        ボード内のインデックス
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */
    //勝利条件全部8パターン
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],//斜め
        [2, 4, 6]//斜め
    ];
    //勝利検証を処理する
    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            //チェック処理
            const winCondition = winningConditions[i];
            //winningCondition[0] -> [0,1,2] -> board[1,2,3,,,,,,]
            //winningCondition[7] -> [2,4,6] -> board[0,,,,4,,,,8] 斜めの場合
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
        console.log("board : " + board);
        //勝ったひとが出たらお知らせとゲーム終了
        if (roundWon) {
                announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);//三項演算子
                isGameActive = false;
                return;
            }
        //勝ったひとが出ない、入力場所もなくなった→引き分けになる
        //配列内にある要素が含まれているかどうかを調べる
        //入力場所まだあるかどうか判定する
        if (!board.includes(''))
            announce(TIE);
    }
    //現在プレイヤーによって格子にxかoを入れる
    const updateBoard =  (index) => {
        board[index] = currentPlayer;
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
        //classList -> 特定の要素のクラス名を追加したり、削除したり、参照したりすること
        //例： <div class="a hide">例文</div> -> <div class="a">例文</div>
        // hideのクラスが削除された
        announcer.classList.remove('hide');
    };
    //選手交代
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
    //ユーザーアクション
    const userAction = (tile, index) => {
        console.log(tile);
        console.log(index);
        if(isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);//現在プレイヤーによって格子にxかoを入れる
            handleResultValidation();//勝利検証を処理する
            changePlayer();//選手交代
        }
    }
    //ゲームリセット
    const resetBoard = () => {
        //ボード
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            //初期化xプレイヤー
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