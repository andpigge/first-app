window.onload = function () {

    //Массив всех тестов
    const arrTest = [
        // {
        //     id: 1,
        //     title: "Название теста",
        //     desc: "Описание теста",
        //     selected: false,
        // },
    ]

    //Объект в котором хранятся результаты тестов
    const objectAnswer = {};

    //Первая чать, создание тестов
    (function (arrTest) {
    //Копия arrTest объект. Вернет объект объектов.
    const objectTest = arrTest.reduce( (acc, test) => {
        acc[test.id] = test;
        return acc;
    }, {});

    //Выборка эллементов
    const containerTest = document.querySelector('.createdTest');
    const formTest = document.forms['createTest'];
    const buttonCreateTest = formTest.elements['submitTest'];
    const contextTitle = formTest.elements['testTitle'];
    const contextDesc = formTest.elements['testDesc'];
    const formButton = document.forms['buttonAllTest'];
    const buttonDeleteSelected = formButton.elements['deleteAll'];

    //2 часть
    const containerInfo = document.querySelector('.infoQuestion');
    const containerQuestions = document.querySelector('.questionsTest');

    //3 часть
    const formTestPass = document.forms['passTest'];
    const itemTest = formTestPass.elements['itemTest'];
    const buttonStartTest = formTestPass.elements['buttonStartTest'];
    const containerStartTest = document.querySelector('.startTest');
    const containerHistory = document.querySelector('.info__container');
    const buttonHistory = document.querySelector('.info__button');

    //Вызов всех функций
    renderTest(objectTest);
    buttonCreateTest.addEventListener('click', createTest);
    containerTest.addEventListener('click', clickRenderTest);
    buttonDeleteSelected.addEventListener('click', deleteSelectedTest);
    //2 часть
    containerQuestions.addEventListener('click', clickRenderForm);
    containerInfo.addEventListener('click', clickRenderQuestion);
    //3 часть
    createListTest();
    buttonStartTest.addEventListener('click', renderStartTest);
    containerStartTest.addEventListener('click', renderContainerTest);
    buttonHistory.addEventListener('click', buttonHistoryDelete);

    //Обрабатываем переданный объект
    function renderTest(objectTest) {
        if (!objectTest) {
            console.error('Передайте объект для вывода на экран страницы');
            return;
        }

        const fragment = document.createDocumentFragment();

        Object.values(objectTest).reverse().forEach(test => {
            const container = createHtml(test);
            fragment.appendChild(container);
        });

        containerTest.appendChild(fragment);
    }

    //Формирование верстки тестов
    function createHtml({id, title, desc}) {
        const arrText = [];
        const arrButton = [];

        const container = document.createElement('div');
        container.classList.add('createdTest__container');
        container.setAttribute('data-test-id', id);

        const containerText = document.createElement('div');
        containerText.classList.add('createdTest__containerText');

        const containerButton = document.createElement('div');
        containerButton.classList.add('createdTest__containerButton');

        const titleEll = document.createElement('h2');
        titleEll.classList.add('createdTest__title');
        titleEll.textContent = `${title}`;

        const descEll = document.createElement('p');
        descEll.classList.add('createdTest__desc');
        descEll.textContent = `${desc}`;

        const buttonRemove = document.createElement('div');
        buttonRemove.classList.add('createdTest__buttonRemove');
        buttonRemove.textContent = 'x';

        const buttonSelect = document.createElement('div');
        buttonSelect.classList.add('button');
        buttonSelect.classList.add('createdTest__buttonSelect');
        buttonSelect.textContent = 'Заполнить вопросы';

        arrText.push(titleEll, descEll);
        arrButton.push(buttonRemove, buttonSelect);

        arrText.forEach(text => {
            containerText.appendChild(text);
        });

        arrButton.forEach(button => {
            containerButton.appendChild(button);
        });

        container.appendChild(containerText);
        container.appendChild(containerButton);
        return container;
    }

    //Создание теста
    function createTest(e) {
        e.preventDefault();

        //Значения введенные пользователем
        const titleValue = contextTitle.value.trim();
        const descValue = contextDesc.value.trim();

        //Валидация формы
        const ansver = checkFormTest(titleValue, descValue);

        if (ansver) {
            //Добавить в объект
            const test = createNewTest(titleValue, descValue);

            //Добавить на страницу
            const testHtml = createHtml(test);
            containerTest.insertAdjacentElement("afterbegin", testHtml);
            formTest.reset();

            //Рендерим список тестов
            renderListTests(test, titleValue);
        }
    }

    //Проверяем на валидность форму. Вернет true или false.
    function checkFormTest(title, desc) {
       if (!title || !desc) {
           alert('Заголовок или описание пусты');
           return false;
       } return true;
    }

    //Добавляем тест в обьект
    function createNewTest(title, desc) {
        const newTest = {
            id: +Math.floor(Math.random() * 100),
            title,
            desc,
            selected: false,
        };

        objectTest[newTest.id] = newTest;

        return newTest;
    }

    //Переменная выводится чтобы знать id нажатого блока, чтобы после его удалить.
    let idData = null;
    //Перекрашиваем тесты
    function clickRenderTest({target}) {
        //Проверяем нажатая кнопка в фокусе ли всего теста
        if (target.classList.contains('createdTest__container') || target.classList.contains('createdTest__containerText') ||
            target.classList.contains('createdTest__containerButton') || target.classList.contains('createdTest__title') ||
            target.classList.contains('createdTest__desc')) {
            //Находим родительский data-атрибут
            const parentData = target.closest('[data-test-id]');
            const idData = parentData.dataset.testId;

            //Перекрашивание эллемента
            backgroundColorEll(parentData, idData);
        }

        //Отдельная кнопка для удаление одиночного теста.
        if (target.classList.contains('createdTest__buttonRemove')) {
            const parentData = target.closest('[data-test-id]');
            const idData = parentData.dataset.testId;

            const deleteTestArr = confirmDeleteArr(idData);

            deleteTest(deleteTestArr, parentData);

            deleteQuestion(idData);

            deleteTestItem(idData);
        }

        //При нажатии на кнопку выбрать
        if (target.classList.contains('createdTest__buttonSelect')) {
            const parentData = target.closest('[data-test-id]');
            idData = parentData.dataset.testId;

            containerInfo.classList.add('infoQuestion_action');
            containerQuestions.classList.add('questionsTest_active');
            document.body.style.overflow = 'hidden';

            const questionHtml = createContextHtml();

            containerQuestions.insertAdjacentHTML("afterbegin", questionHtml);
        }
    }

    //Перекрашивание эллемента
    function backgroundColorEll(parentData, id) {
        parentData.classList.toggle('createdTest__container_border');

        if (parentData.classList.contains('createdTest__container_border')) objectTest[id].selected = true;
        else objectTest[id].selected = false;
    }

    //Удаляем выбранные тесты
    function deleteSelectedTest(e) {
        const {target} = e;
        e.preventDefault();

        const textConfirm = 'Удалить выбранные записи?';
        const confirm = confirmDelete(textConfirm);

        //У того обьекта у которого есть select, берем его
        if (confirm) {
            Object.values(objectTest).forEach(test => {
                if (test.selected) {
                    const id = test.id;

                    deleteTestArr(id);

                    deleteTestHtml(id);

                    deleteQuestion(id);

                    deleteTestItem(id);
                } else alert('Выберите тесты которые хотите удалить');
            });
        }
    }

    //Подтверждение удаления
    function confirmDelete(textConfirm) {
        const isConfirm = confirm(textConfirm);
        if (!isConfirm)
            return false;
        return true;
    }

    //Удаления выбранного теста из обьекта
    function deleteTestArr(id) {
        delete objectTest[id];
    }

    //Удаления выбранного теста из верстки
    function deleteTestHtml(id) {
            const {...children} = containerTest.children;

            Object.values(children).forEach(test => {
                if (+test.dataset.testId === +id) {
                    test.remove();
                }
            });
    }

    //Удаляет вопросы удаленного теста, принимает id из обьекта
    function deleteQuestion(id) {
        const children = [...containerInfo.children];

        children.forEach(question => {
            if (+question.dataset.id === +id) question.remove();
        });
    }

    //Подтверждение и удаление из массива
    function confirmDeleteArr(id) {
        const { title } = objectTest[id];
        const isConfirm = confirm(`Вы точно хотите удалить тест \n${title}`);
        if (!isConfirm) return false;
        delete objectTest.id;
        return isConfirm;
    }

    //Удаление из верстки теста
    function deleteTest(confirm, data) {
        if (confirm) data.remove();
    }

    //Формирование верстки вопросов
    function createContextHtml() {
        const ellelements = `
            <div class="questionsTest__container">
                <div class="questionsTest__text">
                    <h2 class="questionsTest__title">Заполнение теста вопросами</h2>
                    <button class="questionsTest__close">x</button>
                </div>
                <div class="questionsTest__form">
                    <form name="formQuestion">
                        <label for="createTitle" class="label label_color">Введите вопрос для выбранного теста</label>
                        <input type="text" name="createTitle" id="createTitle" class="input input_size" placeholder="Заполните вопрос для выбранного теста.">
                        
                        <label for="createTitle1" class="label label_color">
                            <input type="radio" class="radio" name="correctAnswer" value="createTitle1">
                        Ведите первый вариант ответа</label>
                        <input type="text" name="createTitle1" id="createTitle1" class="input input_size" placeholder="Заполните первый вариант ответа на вопрос.">
                        
                        <label for="createTitle2" class="label label_color">
                            <input type="radio" class="radio" name="correctAnswer" value="createTitle2">
                        Ведите второй вариант ответа</label>
                        <input type="text" name="createTitle2" id="createTitle2" class="input input_size" placeholder="Заполните второй вариант ответа.">
                        
                        <label for="createTitle3" class="label label_color">
                            <input type="radio" class="radio" name="correctAnswer" value="createTitle3">
                        Ведите третий вариант ответа</label>
                        <input type="text" name="createTitle3" id="createTitle3" class="input input_size" placeholder="Заполните третий вариант ответа.">
                        <button type="submit" name="submitQuestion" class="button button_background">Создать вопрос</button>
                    </form>
                </div>
            </div>
        `;

        return ellelements;
    }

    //Вторая часть, создание вопросов
    function clickRenderForm(e) {
        const {target} = e;
        //Закрыть экран формы
        if (target.classList.contains('questionsTest__close')) {
            containerInfo.classList.remove('infoQuestion_action');
            containerQuestions.classList.remove('questionsTest_active');

            document.body.style.overflow = 'visible';

            const question = {...containerQuestions.children};
            Object.values(question).forEach(ell => {
                ell.remove();
            });
        }
        //Добавление вопроса
        if (target.name === 'submitQuestion') {
            e.preventDefault();

            const form = document.forms['formQuestion'];
            const question = form.elements['createTitle'];
            const question1 = form.elements['createTitle1'];
            const question2 = form.elements['createTitle2'];
            const question3 = form.elements['createTitle3'];
            const answer = form.elements['correctAnswer'];

            const questionValue = question.value.trim();
            const questionValue1 = question1.value.trim();
            const questionValue2 = question2.value.trim();
            const questionValue3 = question3.value.trim();
            const answerValue = answer.value;

            //Валидация
            const answerQuestion = checkFormQuestion(questionValue, questionValue1, questionValue2, questionValue3, answerValue);

            //Добавляет в обьект и верстку из обьекта
            if (answerQuestion) {
                const question = createNewQuestion(questionValue, questionValue1, questionValue2, questionValue3, answerValue);
                form.reset();
            }
        }
    }

    //Валидация формы
    function checkFormQuestion(value, value1, value2, value3, answer) {
        if (!value || !value1 || !value2 || !value3 || !answer) {
            alert('Заполните все поля в форме');
            return false;
        } return true;
    }

    //Добавление в обьект
    function createNewQuestion(value, value1, value2, value3, answer) {
        const randomNumber = 'id_'+(Math.floor(Math.random() * 1000));

        const newQuestion = {
            randomId: randomNumber,
            id: idData,
            createTitle: value,
            createTitle1: value1,
            createTitle2: value2,
            createTitle3: value3,
            answer,
            selected: false,
        };

        newQuestion.answerValue = newQuestion[answer];

        objectTest[newQuestion.id][randomNumber] = newQuestion;

        const questionHtml = createQuestionHtml(newQuestion.id, randomNumber ,newQuestion.createTitle, newQuestion.answerValue);
        //При нажатии на выбрать формируется верстка
        containerInfo.appendChild(questionHtml);
    }

    //Верстка вопроса
    function createQuestionHtml(id, randomId, question, answer) {
        const arr = [];

        const container = document.createElement('div');
        container.classList.add('infoQuestion__containerQuestion');
        container.setAttribute('data-id', id);
        container.setAttribute('data-random', randomId);

        const containerText = document.createElement('div');
        containerText.classList.add('infoQuestion__containerText');

        const containerButton = document.createElement('div');
        containerButton.classList.add('infoQuestion__containerButton');

        const button = document.createElement('div');
        button.classList.add('infoQuestion__buttonDelete');
        button.textContent = 'x';

        const title = document.createElement('h2');
        title.classList.add('infoQuestion__title');
        title.textContent = 'Заголовок выбранного теста:';

        const titleQyestion = title.cloneNode();
        titleQyestion.textContent = 'Записанный вопрос:';

        const titleAnsver = title.cloneNode();
        titleAnsver.textContent = 'Правильный ответ:';

        const titleTest = document.createElement('p');
        titleTest.classList.add('infoQuestion__titleTest');
        titleTest.textContent = objectTest[id].title;

        const questionEll = document.createElement('p');
        questionEll.classList.add('infoQuestion__question');
        questionEll.textContent = question;

        const answerEll = document.createElement('p');
        answerEll.classList.add('infoQuestion__answer');
        answerEll.textContent = answer;

        title.appendChild(titleTest);
        titleQyestion.appendChild(questionEll);
        titleAnsver.appendChild(answerEll);

        arr.push(title, titleQyestion, titleAnsver);

        arr.forEach(ell => {
            containerText.appendChild(ell);
        });

        containerButton.appendChild(button);

        container.appendChild(containerText);
        container.appendChild(containerButton);

        return container;
    }

    //Обрабатываем клик на вопрос на страницу
    function clickRenderQuestion(e) {
        const {target} = e;

        if (target.classList.contains('infoQuestion__buttonDelete')) {
            const parentData = target.closest('[data-random]');
            const idData = parentData.dataset.random;
            const idDataTest = parentData.dataset.id;

            const deleteQuestionArr = confirmDeleteQuestion(idDataTest, idData);

            const deleteHtml = buttonQuestionDelete(deleteQuestionArr, parentData);
        }
    }

    //Подтверждение и удаление из обьекта вопроса
    function confirmDeleteQuestion(idTest, id) {
        const { createTitle } = objectTest[idTest][id];
        const isConfirm = confirm(`Вы точно хотите удалить вопрос \n${createTitle}`);
        if (!isConfirm) return false;
        delete objectTest[idTest][id];
        return isConfirm;
    }

    //Удаляем вопрос
    function buttonQuestionDelete(confirm, data) {
        if (confirm) data.remove();
    }

    //3 часть
    //Добавляем в select option со страницы
    function createListTest() {
        const {...children} = containerTest.children;

        Object.values(children).forEach(test => {
            const idData = test.dataset.testId;
            const {title} = objectTest[idData];

            const html = createListTestsHtml(idData, title);
            itemTest.appendChild(html);
        });
    }

    //Рендерим при нажатии на создать тест
    function renderListTests({id}, titleValue) {
        const html = createListTestsHtml(id, titleValue);
        itemTest.appendChild(html);
    }

    //Создаем верстке option
    function createListTestsHtml(idData, title) {
        const option = document.createElement('option');
        option.value = idData;
        option.textContent = title;
        option.setAttribute('selected', 'selected');
        return option;
    }

    //Удаляем option
    function deleteTestItem(id) {
        const {...children} = itemTest.children;
        Object.values(children).forEach(test => {
            if (+(test.value) === +id) {
                test.remove();
            }
        });
    }

    //Прохождение теста, обработка
    function renderStartTest(e) {
        e.preventDefault();
        const {target} = e;

        const activeTest = itemTest.value;

        const confirm = confirmStartTest(activeTest);

        if (!confirm) {
            alert('Вопросы по тесту отсуствуют');
            return;
        }

        startTest(activeTest);

        if (containerStartTest.classList.contains('startTest_active')) {
            const button = startTestCreateButton();
            containerStartTest.appendChild(button);
        }

        //Плавный скрол
        containerStartTest.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    function confirmStartTest(activeTest) {
        let value = '';
        Object.values(objectTest).forEach(obj => {
            Object.values(obj).forEach(question => {
                if (question.id === activeTest) {
                   value = true;
                }
            });
        });
        return value;
    }

    //Прохождение теста
    function startTest(id) {
        containerStartTest.classList.add('startTest_active');

        const object = objectTest[id];

        //Удаляем все из еллемента
        deleteStartTest();


        Object.values(object).forEach(question => {
            if (question.id === id) {
                const randomNumberRadio = Math.floor(Math.random()*1000);
                const randomNumberForm = Math.floor(Math.random()*1000);
                const html = startTestHtml(id, randomNumberForm, randomNumberRadio, question);
                containerStartTest.insertAdjacentHTML("afterbegin", html);
            }
        });
    }

    function startTestHtml(id, randomNumberForm, randomNumber, {createTitle, createTitle1, createTitle2, createTitle3, createTitle4}) {
        const container = `
            <div class="startTest__container" data-id="${id}" data-name="startTestRadio-${randomNumber}" data-forName="form-${randomNumberForm}">
                <h2 class="startTest__question">${createTitle}</h2>
                <form name="form-${randomNumberForm}">
                <h3 class="startTest__title">
                    <input type="radio" class="radio" name="startTestRadio-${randomNumber}" value="${createTitle1}" checked>
                ${createTitle1}</h3>
                
                <h3 class="startTest__title">
                    <input type="radio" class="radio" name="startTestRadio-${randomNumber}" value="${createTitle2}">
                ${createTitle2}</h3>
                
                <h3 class="startTest__title">
                    <input type="radio" class="radio" name="startTestRadio-${randomNumber}" value="${createTitle3}">
                ${createTitle3}</h3>
                </form>
            </div>
        `;
        return container;
    }

    function deleteStartTest() {
        const {...children} = containerStartTest.children;
        Object.values(children).forEach(ell => {
            ell.remove();
        });
    }

    //Верстка кнопки сдать тест
    function startTestCreateButton() {
        const button = document.createElement('button');
        button.textContent = 'Сдать тест';
        button.classList.add('button');
        button.classList.add('startTest__button');
        return button;
    }

    //Обработка нажатия кнопки сдать тест
    function renderContainerTest({target}) {
        if (target.classList.contains('startTest__button')) {

            const confirm = complitedTest();
            resultTest(objectTest, confirm);
        }
    }

    //Подтверждение закончить тест
    function complitedTest() {
        const isConfirm = confirm(`Завершить тест?`);
        if (!isConfirm) return false;
        return isConfirm;
    }

    //Перебор контейнера в котором записаны тесты, получение из него data-атрибутов
    function resultTest(objectTest, confirm) {
        if (confirm) {
            let data = '';

            const {...children} = containerStartTest.children;

            //Массив выбранных ответов
            const dataArr = [];

            Object.values(children).forEach(ell => {
                if (ell.dataset.name) {
                    //Массив правильных ответов
                    const correctValue = [];

                    const dataTestId = ell.dataset.id;
                    const dataId = ell.dataset.id;
                    const dataForm = ell.dataset.forname;
                    const dataCheck = ell.dataset.name;

                    //Выбранный ответ
                    const dataAnswer = objectResultTest(dataForm, dataCheck);
                    dataArr.push(dataAnswer);

                    //Формирование массива правильных ответов
                    correctArrAnswer(dataId, correctValue);

                    //Формирование объекта с ответами
                    const createObjAnswer = createObjAnswers(dataTestId, dataArr, correctValue);

                    const obj = renderObjAnswers(createObjAnswer);

                    data = dataId;
                }
            });

            //Удаляет данные из коннтейнера прохождение тестов
            deleteContainerData();

            //Формирование верстки количесво правильных ответов по прохождению теста
            const createHtml = containerOutputHtml(objectAnswer[data]);
            containerStartTest.appendChild(createHtml);

            // containerHistory
            const historyHtml = containerHistoryHtml(objectTest[data].title, objectAnswer[data]);
            containerHistory.appendChild(historyHtml);

            if (!containerHistory.classList.contains('info__container_active')) {
                containerHistory.classList.add('info__container_active');
            }
        }
    }

    //Возвращает объект выбранных ответов
    function objectResultTest(dataForm, dataCheck) {
        const form = document.forms[dataForm];
        const check = form.elements[dataCheck];

        const checkValue = check.value;
        return checkValue;
    }

    function correctArrAnswer(dataId, correctValue) {
        const {...children} = containerStartTest.children;

        Object.values(objectTest[dataId]).forEach(value => {
            const answer = value.answerValue;
            if (answer) {
                correctValue.push(answer);
            };
        });
    }

    function createObjAnswers(dataTestId, dataArr, correctValue) {
        objectAnswer[dataTestId] = {};
        objectAnswer[dataTestId].checkAnswer = dataArr;

        objectAnswer[dataTestId].answerCorrect = correctValue.reverse();
        return objectAnswer[dataTestId];
    }

    function renderObjAnswers(createObj) {
        const lenghtQuestion = createObj.checkAnswer.length;

        createObj.lenghtQuestion = lenghtQuestion;

        let a = 0;
        let i = lenghtQuestion-1;
        for (i; i >= 0; i--) {
            if (createObj.checkAnswer[i] === createObj.answerCorrect[i]) {
                a++;
            }
        }
        createObj.correctAnswer = a;
        return createObj;
    }

    function deleteContainerData() {
        const {...children} = containerStartTest.children;

        Object.values(children).forEach(ell => {
            ell.remove();
        });
    }

    function containerOutputHtml(obj) {
        const arrContainerAnswer = [];
        const arrcontainerQuestion = [];

        const container = document.createElement('div');
        container.classList.add('containerOutput');

        const containerAnswer = document.createElement('div');
        containerAnswer.classList.add('containerOutput__container');

        const titleAnswer = document.createElement('h2');
        titleAnswer.classList.add('containerOutput__title');
        titleAnswer.textContent = 'Колличесво правильных ответов:';

        const correctAnswer = document.createElement('p');
        correctAnswer.classList.add('containerOutput__correctAnswer');
        correctAnswer.textContent = `${obj.correctAnswer} из ${obj.lenghtQuestion}`;

        const containerQuestion = document.createElement('div');
        containerQuestion.classList.add('containerOutput__container');

        const titleQuestion = document.createElement('h2');
        titleQuestion.classList.add('containerOutput__title');
        titleQuestion.textContent = 'Колличесво всего вопросов:';

        const lengthQuestion = document.createElement('p');
        lengthQuestion.classList.add('containerOutput__lengthQuestion');
        lengthQuestion.textContent = obj.lenghtQuestion;

        arrContainerAnswer.push(titleAnswer, correctAnswer);
        arrcontainerQuestion.push(titleQuestion, lengthQuestion);

        arrcontainerQuestion.forEach(ell => {
            containerQuestion.appendChild(ell);
        });

        arrContainerAnswer.forEach(ell => {
            containerAnswer.appendChild(ell);
        });

        container.appendChild(containerQuestion);
        container.appendChild(containerAnswer);

        return container;
    }

    function containerHistoryHtml(title, obj) {
        const arrContainerAnswer = [];
        const arrContainerQuestion = [];
        const arrContainerNameTest = [];

        const container = document.createElement('div');
        container.classList.add('info__containerHistory');


        const containerTitle = document.createElement('div');
        containerTitle.classList.add('info__containerTitle');

        const testTitle = document.createElement('h4');
        testTitle.classList.add('info__testTitle');
        testTitle.textContent = 'Название теста: ';

        const testName = document.createElement('p');
        testName.classList.add('info__testName');
        testName.textContent = title;


        const containerAnswer = document.createElement('div');
        containerAnswer.classList.add('info__containerAnswer');

        const titleAnswer = document.createElement('h4');
        titleAnswer.classList.add('info__title');
        titleAnswer.textContent = 'Правильные ответы:';

        const correctAnswer = document.createElement('p');
        correctAnswer.classList.add('info__correctAnswer');
        correctAnswer.textContent = obj.correctAnswer;


        const containerQuestion = document.createElement('div');
        containerQuestion.classList.add('info__containerQuestion');

        const titleQuestion = document.createElement('h4');
        titleQuestion.classList.add('info__title');
        titleQuestion.textContent = 'Всего вопросов:';

        const lengthQuestion = document.createElement('p');
        lengthQuestion.classList.add('info__lengthQuestion');
        lengthQuestion.textContent = obj.lenghtQuestion;

        arrContainerNameTest.push(testTitle, testName);
        arrContainerAnswer.push(titleAnswer, correctAnswer);
        arrContainerQuestion.push(titleQuestion, lengthQuestion);

        arrContainerNameTest.forEach(ell => {
            containerTitle.appendChild(ell);
        });

        arrContainerQuestion.forEach(ell => {
            containerQuestion.appendChild(ell);
        });

        arrContainerAnswer.forEach(ell => {
            containerAnswer.appendChild(ell);
        });

        container.appendChild(containerTitle);
        container.appendChild(containerQuestion);
        container.appendChild(containerAnswer);

        return container;
    }

    function buttonHistoryDelete() {
        const confirm = confiremDeleteHistory();
    }

    function confiremDeleteHistory() {
        const text = 'Удалить историю прохождения тестов?';
        const confirm = confirmDelete(text);

        if (confirm) {
            const {...children} = containerHistory.children;
            if (Object.values(children).length === 0) {
                alert('Итория тестов пуста!');
                return;
            }
            Object.values(children).forEach(ell => {
                ell.remove();
            });
            containerHistory.classList.remove('info__container_active');

            console.log(objectAnswer)
            console.log(objectTest)
        }
    }

    }(arrTest));
}
