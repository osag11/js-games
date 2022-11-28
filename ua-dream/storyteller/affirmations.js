
let affirmations = [];
const activeAffirmations = [];

function prepareAffirmationsData() {
  clearArray(affirmations);
    affirmationsTemplates.forEach((set) => {
        set.list.forEach((item) => {
            affirmations.push({
                fontMin: set.fontSize.min,
                fontMax: set.fontSize.max,
                text: item
            });
        });
    });

    affirmations = shuffle(affirmations);
}

let affIdx = 0;

function showNextAffirmation(x, y) {
    if (affIdx >= affirmations.length) {
        affIdx = 0;
    }

    let aff = affirmations[affIdx];
    addAffirmation(aff, x, y);
    affIdx++;
}

function addAffirmation(affirmation, x, y) {
    activeAffirmations.unshift(
        {
            text: affirmation.text,
            x: x ? x : getRandom(0, canvas.width),
            y: y ? y : getRandom(0, canvas.height),
            angle: getRandom(-70, 70),
            color: addOpacity(getRandomUAColor(), 0.4),
            fontSize: getRandom(affirmation.fontMin, affirmation.fontMax),
        }
    );
}

// Define your own feeling and dreams text and font size here:
const affirmationsTemplates = [
    {
        fontSize: { min: 18, max: 36 },
        list: [
            // UA multiline
            "війна закінчиться нашою перемогою | і в мене буде випускний",
            "навколо мене цілий світ добрих людей | які нам всім допомагають",
            "в мене є робота яка дає | багато грошей та задоволення",
            "мій тато повернувся з війни | і знову вдома",
            "Успіхи ЗСУ надихає на добрі справи | та жагу особисто розвиватися",

            // special multiline quotes ` ` in javascript:
            `І вам, лицарі великі, Богом не забуті.  
            Борітеся — поборете! Вам Бог помагає! 
            За вас правда, за вас слава 
            І воля святая!
            Т.Г. Шевченко`],
    },
    {
        fontSize: { min: 32, max: 64 },
        list: [
            // ENG
            "Mama is healthy", "Papa at home", "Our home is OK", "My city is free", "I Am Happy",
            "putin executed in Hague", "Glory to Heroes",
            "We won and free!", "For Ukrainian Victory!", "Love, Peace, Freedom!",
        ]
    },
    {
        fontSize: { min: 20, max: 40 },
        list: [
            // UA
            // "Воля переможе!", "Слава Україні!", "Героям Слава!",
            "моє місто відбудоване та безпечне", "моя мама здорова", "мене не зламати на шляху до моєї мрії", "мій собака та кіт в добрих руках",
            // "я вирішую як буде далі", "надія є, бо мені Бог допомагає", "наше місто належить тільки нам",
            // "з моїми бабусею і дідусем все добре", "всі мої друзі повернулися", "ми перемогли а я навчився програмувати",
            // "я люблю життя ціную волю як ніколи раніше", "я зароблю програмістом на новий будинок", "мій новий будинок буде кращим за старий",
            // "Україна є і завжди буде нашим домом", "моя сім'я в безпеці", "я куплю всім друзям нові ноутбуки",
            // "я буду жити добре та вільною людиною", "перед мною відкритий цілий світ можливостей", 
            "я залишетимусь доброю та сильною людиною",
        ]
    },
    {
        fontSize: { min: 16, max: 32 },
        list: [
            // RU
            // "мой город отстроен и безопасен", "моя мама здорова", "мой папа вернулся живой и снова дома", 
            // "с моими бабушкой и дедушкой все хорошо", "война закончится победой, и у меня будет выпускной", 
            // "все мои друзья вернулись", "мы победили, я научусь программировать", "я люблю жизнь", "я заработаю программистом на новый дом", 
            // "мой новый дом будет лучше старого", "мой город принадлежит только нам", "Украина есть и всегда будет нашим домом", 

            // RU multiline    
            "я заработаю программированием много денег | и задоначу на ЗСУ все деньги | чтобы война никогда не повторилось"
        ]
    }
];