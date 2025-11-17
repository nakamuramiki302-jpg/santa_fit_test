const questions = [
    {
        id: 1,
        text: "❄️ 寒いのは得意？",
        comment: "赤い服1枚で北極に行ける？コートは論外！",
        category: "寒さ耐性"
    },
    {
        id: 2,
        text: "💰 時給は気にしないタイプ？",
        comment: "サンタは基本ただ働き",
        category: "奉仕精神"
    },
    {
        id: 3,
        text: "🦌 動物と仲良くなれる？",
        comment: "トナカイの見分けも出来るよね！？",
        category: "動物親和性"
    },
    {
        id: 4,
        text: "🎄 クリスマスというイベント自体が好き？",
        comment: "サンタクロースはクリスマスが好きじゃないと！",
        category: "クリスマス愛"
    },
    {
        id: 5,
        text: "📝 暗記は得意？",
        comment: "トナカイ9匹の名前はマストで暗記だよ",
        category: "記憶力"
    },
    {
        id: 6,
        text: "💪 体力に自信はある？",
        comment: "24時間以内に世界一周しないと！",
        category: "体力・持久力"
    },
    {
        id: 7,
        text: "🌙 夜型人間？",
        comment: "サンタクロースは夜間勤務だよ",
        category: "生活リズム"
    },
    {
        id: 8,
        text: "🤐 口は硬いほう？",
        comment: "サンタであることは口外禁止！",
        category: "秘密保持"
    },
    {
        id: 9,
        text: "🚗 車の運転は得意？一発で駐車できる？",
        comment: "ソリの着地、失敗しないでね",
        category: "操縦技術"
    },
    {
        id: 10,
        text: "🚽 トイレは近くないほう？",
        comment: "クリスマスの夜はトイレ休憩なし",
        category: "膀胱耐久力"
    }
];

let answers = {};

const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const questionsList = document.getElementById('questions-list');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');

function init() {
    answers = {};
    renderQuestions();
    quizContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    updateSubmitButton();
}

function renderQuestions() {
    questionsList.innerHTML = '';

    questions.forEach((question, index) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';

        questionItem.innerHTML = `
            <div class="question-number">質問 ${index + 1} / ${questions.length}</div>
            <div class="question-text">${question.text}</div>
            <div class="options-wrapper">
                <div class="options-container">
                    <span class="option-label">当てはまる</span>
                    <div class="options" data-question-id="${question.id}">
                        ${[5, 4, 3, 2, 1].map(value =>
            `<button class="option-btn" data-value="${value}"></button>`
        ).join('')}
                    </div>
                    <span class="option-label">当てはまらない</span>
                </div>
            </div>
            ${question.comment ? `<div class="question-comment">${question.comment}</div>` : ''}
        `;

        questionsList.appendChild(questionItem);
    });

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const questionId = parseInt(e.target.closest('.options').dataset.questionId);
            const value = parseInt(e.target.dataset.value);

            e.target.closest('.options').querySelectorAll('.option-btn').forEach(b => {
                b.classList.remove('selected');
            });

            e.target.classList.add('selected');
            answers[questionId] = value;
            updateSubmitButton();
        });
    });
}

function updateSubmitButton() {
    const allAnswered = Object.keys(answers).length === questions.length;
    submitBtn.disabled = !allAnswered;
}

submitBtn.addEventListener('click', showResult);

function showResult() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    const answerValues = Object.values(answers);
    const totalScore = answerValues.reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 5;
    const percentage = Math.round((totalScore / maxScore) * 100);

    animateScore(percentage);

    const { santaLanguage, japaneseTranslation, advice } = generateComment(percentage, answers);
    document.getElementById('santa-language').textContent = santaLanguage;
    document.getElementById('japanese-translation').textContent = '【日本語訳】\n' + japaneseTranslation;
    document.getElementById('advice-text').textContent = advice;

    renderAnalysisChart(answers);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function animateScore(targetPercentage) {
    const scoreElement = document.getElementById('score-percentage');
    let current = 0;
    const increment = targetPercentage / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= targetPercentage) {
            current = targetPercentage;
            clearInterval(timer);
        }
        scoreElement.textContent = Math.round(current);
    }, 20);
}

function generateComment(percentage, answers) {
    const emojis = ['🎅', '🎄', '⭐️', '❄️', '🎁', '💕', '🎉', '✨', '🌟', '🔔', '🦌', '🤶'];
    const santaWords = ['ホッホッホ', 'ホホホー', 'ホッ', 'ホホホホホ', 'ホーホーホー'];

    function getRandomEmojis(count) {
        let result = '';
        for (let i = 0; i < count; i++) {
            result += emojis[Math.floor(Math.random() * emojis.length)] + ' ';
        }
        return result.trim();
    }

    function generateSantaLanguage() {
        const wordCount = 8 + Math.floor(Math.random() * 5);
        let result = [];
        for (let i = 0; i < wordCount; i++) {
            result.push(santaWords[Math.floor(Math.random() * santaWords.length)]);
        }
        return result.join('！ ') + '！';
    }

    let japaneseTranslation = '';
    let advice = '';

    if (percentage >= 90) {
        const messages = [
            `完璧だ！${getRandomEmojis(4)} あなたは生まれながらのサンタクロースだ！寒さにも強く、体力もあり、動物とも仲良くできる。そして何より、クリスマスへの愛と奉仕の心が素晴らしい！${getRandomEmojis(3)} 今すぐ北極に来てくれ！トナカイたちも大喜びだよ！赤い服のサイズを測っておこう！あなたのような人材を何年も探していたんだ。プレゼント配りの技術も、きっとすぐにマスターできるはずだ。${getRandomEmojis(2)} 世界中の子供たちが、あなたの訪問を待っているよ！`,
            `素晴らしい！${getRandomEmojis(4)} あなたこそ真のサンタの後継者だ！すべての項目で高得点を取るなんて、信じられない！${getRandomEmojis(3)} 私の引退後はあなたに任せたい！プレゼント配りのコツを今から教えよう！北極での生活は厳しいけど、あなたなら大丈夫だ。トナカイの操縦も、秘密の守り方も、すべて伝授するよ。${getRandomEmojis(2)} 一緒に世界中に笑顔を届けよう！あなたとなら、最高のクリスマスが作れる！`,
            `驚いた！${getRandomEmojis(4)} あなたのサンタ適性は私以上かもしれない！こんなに完璧な候補者は初めてだ！${getRandomEmojis(3)} 今年のクリスマスは一緒に世界を回ろう！トナカイも大歓迎だ！あなたの体力と精神力なら、24時間の世界一周も楽々こなせるはず。${getRandomEmojis(2)} 寒さにも強く、秘密も守れる。完璧だ！北極の家には空き部屋があるから、いつでも来てくれ！新しいサンタの時代が始まるよ！`
        ];
        japaneseTranslation = messages[Math.floor(Math.random() * messages.length)];

        const adviceMessages = [
            `${getRandomEmojis(3)} あなたはもう完璧だ！強いて言えば、ソリの着陸技術をもう少し磨けば、屋根の上への着地がさらにスムーズになるよ。あとは、世界中の子供たちの名前を覚える練習をしておこう。${getRandomEmojis(2)} 北極での研修は1週間もあれば十分だ。トナカイたちとの絆を深めて、最高のチームを作ろう！クリスマスイブが楽しみだね！`,
            `${getRandomEmojis(3)} 完璧なサンタ候補だ！今のあなたに必要なのは、実践経験だけ。まずは小さな町から始めて、徐々に範囲を広げていこう。${getRandomEmojis(2)} トナカイの名前（ダッシャー、ダンサー、プランサー、ヴィクセン、コメット、キューピッド、ドナー、ブリッツェン、ルドルフ）は必ず覚えてね！あなたなら、すぐに一人前のサンタになれるよ！`
        ];
        advice = adviceMessages[Math.floor(Math.random() * adviceMessages.length)];
    } else if (percentage >= 70) {
        const messages = [
            `素晴らしい！${getRandomEmojis(4)} あなたはサンタになる素質が十分にある！ほとんどの項目で高得点だ！${getRandomEmojis(3)} 少し訓練すれば、立派なサンタになれるよ！まずはトナカイの名前から覚えよう！寒さ対策や体力づくりも大切だけど、あなたの基礎能力は素晴らしい。${getRandomEmojis(2)} 北極での3ヶ月研修プログラムを用意しよう！ソリの運転も、プレゼントの配り方も、すべて教えるよ。あなたなら絶対にできる！`,
            `良い感じだ！${getRandomEmojis(4)} サンタ見習いとして採用したい！あなたの適性は本物だ！${getRandomEmojis(3)} 北極での研修プログラムを用意しよう！寒さ対策の特訓から始めるぞ！体力トレーニングと、トナカイとのコミュニケーション訓練も必要だね。${getRandomEmojis(2)} でも心配しないで！あなたの基礎能力なら、半年もあれば一人前のサンタになれる。一緒に頑張ろう！クリスマスの魔法を世界に届けよう！`
        ];
        japaneseTranslation = messages[Math.floor(Math.random() * messages.length)];

        const adviceMessages = [
            `${getRandomEmojis(3)} あなたの弱点を克服しよう！寒さ対策として、毎日冷水シャワーを浴びる習慣をつけるといいよ。体力づくりには、ランニングと筋トレがおすすめ。${getRandomEmojis(2)} 動物園に通って、動物とのコミュニケーション能力を高めよう。夜型生活に慣れるため、少しずつ就寝時間を遅らせていこう。あなたなら、きっと素晴らしいサンタになれる！諦めずに頑張って！`,
            `${getRandomEmojis(3)} 良いスタートだ！まずは得意分野を伸ばしつつ、苦手な部分を少しずつ改善していこう。トナカイの名前を覚える練習と、ソリの操縦シミュレーターでの訓練を始めよう。${getRandomEmojis(2)} 秘密を守る訓練として、日記をつけて自己管理能力を高めるのもいいね。北極での研修が待ってるよ！一緒に最高のサンタを目指そう！`
        ];
        advice = adviceMessages[Math.floor(Math.random() * adviceMessages.length)];
    } else if (percentage >= 50) {
        const messages = [
            `悪くない！${getRandomEmojis(3)} サンタの素質はあるけど、まだ修行が必要だね！いくつかの項目で課題が見られるよ。${getRandomEmojis(2)} 特に寒さ対策と体力づくりを頑張ろう！応援してるよ！サンタ補助スタッフとして働きながら、経験を積むのもいいかもしれない。${getRandomEmojis(2)} プレゼントの包装や、リスト管理から始めてみよう。焦らず、一歩ずつ成長していけば、いつかは立派なサンタになれる！あなたのペースで頑張ろう！`,
            `まあまあだ！${getRandomEmojis(3)} サンタ補助スタッフとしてなら活躍できそう！完璧なサンタになるには、もう少し努力が必要だね。${getRandomEmojis(2)} プレゼントの包装係から始めてみるのはどうかな？北極の工房で働きながら、サンタの仕事を学んでいこう。${getRandomEmojis(2)} 寒さに慣れる訓練、体力づくり、動物との触れ合い、すべて実践で学べるよ。諦めなければ、必ず道は開ける！一緒にクリスマスを盛り上げよう！`
        ];
        japaneseTranslation = messages[Math.floor(Math.random() * messages.length)];

        const adviceMessages = [
            `${getRandomEmojis(2)} まずは基礎体力をつけることから始めよう！毎日30分のウォーキングから始めて、徐々にランニングに移行していこう。寒さに慣れるため、冬は薄着で過ごす練習をしてみて。${getRandomEmojis(2)} 動物園や牧場でボランティアをして、動物との触れ合いに慣れよう。夜型生活への移行も少しずつ進めていこう。焦らず、着実に成長していけば大丈夫！あなたのペースで頑張って！`,
            `${getRandomEmojis(2)} 苦手な分野を一つずつ克服していこう！まずは得意なことを活かして、サンタの仕事に関わることから始めよう。プレゼント選びのセンスを磨いたり、子供たちの願いを理解する力を養ったり。${getRandomEmojis(2)} 体力や寒さ耐性は、時間をかけてゆっくり鍛えていけばいい。完璧なサンタを目指すより、あなたらしいサンタを目指そう！個性を活かして頑張って！`
        ];
        advice = adviceMessages[Math.floor(Math.random() * adviceMessages.length)];
    } else if (percentage >= 30) {
        const messages = [
            `うーん...${getRandomEmojis(2)} サンタになるのは少し難しいかも！多くの項目で課題があるね。${getRandomEmojis(2)} でも諦めないで！まずは暗記力と体力をつけることから始めよう！サンタの道は険しいけど、不可能じゃない。${getRandomEmojis(1)} 長期的な視点で、少しずつ改善していこう。サンタを応援する側として活躍する道もあるよ。クリスマスの精神を大切にして、自分にできることから始めよう！あなたの優しい心は、きっと誰かの役に立つはずだ！`,
            `正直に言うと...${getRandomEmojis(2)} サンタよりも別の仕事が向いてるかも！でもクリスマスを楽しむ心は大切だよ！${getRandomEmojis(2)} プレゼントをもらう側で楽しもう！サンタになることだけがクリスマスの楽しみ方じゃない。${getRandomEmojis(1)} あなたには、あなたにしかできない役割があるはず。家族や友人にプレゼントを贈ったり、クリスマスパーティーを企画したり。そういう形でクリスマスの魔法を広げていこう！`
        ];
        japaneseTranslation = messages[Math.floor(Math.random() * messages.length)];

        const adviceMessages = [
            `${getRandomEmojis(2)} サンタになるのは難しいかもしれないけど、クリスマスに関わる方法はたくさんあるよ！ボランティアで子供たちにプレゼントを配ったり、クリスマスイベントのスタッフとして働いたり。${getRandomEmojis(1)} あなたの優しい心があれば、きっと誰かを幸せにできる。完璧なサンタを目指すより、あなたらしい形でクリスマスの喜びを広げていこう！それも素晴らしいことだよ！`,
            `${getRandomEmojis(2)} 無理にサンタを目指す必要はないよ。でも、クリスマスの精神は大切にしてね。家族や友人を大切にして、感謝の気持ちを伝えることから始めよう。${getRandomEmojis(1)} プレゼントを贈る喜び、誰かを笑顔にする喜びを感じることが大切だ。あなたには、あなたにしかできない素敵な役割があるはず。自分らしく、クリスマスを楽しもう！`
        ];
        advice = adviceMessages[Math.floor(Math.random() * adviceMessages.length)];
    } else {
        const messages = [
            `これは...困った！${getRandomEmojis(2)} サンタになるのはかなり厳しいね！ほとんどの項目で低得点だ。${getRandomEmojis(2)} でも心配しないで！サンタを信じる心があれば、それで十分だよ！サンタになることだけが人生じゃない。${getRandomEmojis(1)} あなたには、あなたの才能を活かせる別の道があるはず。クリスマスは、温かい部屋で家族と過ごすのが一番だよ。プレゼントをもらう側として、クリスマスの魔法を楽しもう！それも素敵な過ごし方だ！`,
            `正直に言おう...${getRandomEmojis(2)} あなたはサンタには向いていない！寒さも苦手、夜も苦手、動物も苦手...でもね、それがあなたの個性だ！${getRandomEmojis(2)} 世界にはいろんな役割がある！あなたらしい道を見つけよう！${getRandomEmojis(1)} サンタを応援する側、プレゼントを喜ぶ側、クリスマスを楽しむ側、どれも大切な役割だ。無理にサンタを目指すより、自分の得意なことを活かして、幸せなクリスマスを過ごそう！`
        ];
        japaneseTranslation = messages[Math.floor(Math.random() * messages.length)];

        const adviceMessages = [
            `${getRandomEmojis(2)} サンタを目指すのは諦めて、別の道を探そう！あなたには、もっと向いている素敵な仕事があるはず。${getRandomEmojis(1)} クリスマスは、温かい部屋でココアを飲みながら、家族や友人と過ごすのが一番だよ。プレゼントをもらう喜びを存分に味わおう！サンタに感謝の手紙を書くのもいいね。あなたらしい、幸せなクリスマスを過ごしてね！それが一番大切なことだよ！`,
            `${getRandomEmojis(2)} 無理にサンタを目指す必要は全くないよ！あなたの個性を大切にして、自分に合った生き方を見つけよう。${getRandomEmojis(1)} 暖かい場所が好き、昼間が好き、人間が好き、それは素晴らしいことだ！クリスマスは、自分らしく楽しむのが一番。美味しい料理を食べて、プレゼント交換をして、笑顔で過ごそう。それが最高のクリスマスだよ！`
        ];
        advice = adviceMessages[Math.floor(Math.random() * adviceMessages.length)];
    }

    return {
        santaLanguage: generateSantaLanguage(),
        japaneseTranslation: japaneseTranslation,
        advice: advice
    };
}

function renderAnalysisChart(answers) {
    const chartContainer = document.getElementById('analysis-chart');
    chartContainer.innerHTML = '';

    questions.forEach(question => {
        const score = answers[question.id];
        const percentage = (score / 5) * 100;

        const chartItem = document.createElement('div');
        chartItem.className = 'chart-item';

        chartItem.innerHTML = `
            <div class="chart-label">
                <span>${question.category}</span>
                <span>${score}/5</span>
            </div>
            <div class="chart-bar-container">
                <div class="chart-bar" style="width: 0%"></div>
            </div>
        `;

        chartContainer.appendChild(chartItem);

        setTimeout(() => {
            const bar = chartItem.querySelector('.chart-bar');
            bar.style.width = percentage + '%';
        }, 100);
    });
}

restartBtn.addEventListener('click', init);

// 背景に絵文字をランダムに配置
function createBackgroundEmojis() {
    const emojis = ['🎅', '🎄', '⭐️', '❄️', '🎁', '💕'];
    const container = document.querySelector('.background-decorations');

    // 50個の絵文字を生成
    for (let i = 0; i < 50; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        // ランダムな位置
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.top = Math.random() * 100 + '%';

        // ランダムなサイズ
        const size = 20 + Math.random() * 30;
        emoji.style.fontSize = size + 'px';

        // ランダムなアニメーション遅延
        emoji.style.animationDelay = Math.random() * 5 + 's';
        emoji.style.animationDuration = (8 + Math.random() * 4) + 's';

        container.appendChild(emoji);
    }
}

init();
createBackgroundEmojis();
