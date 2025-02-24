Одна из причин использования точной (`fine-grained`) реактивности в Solid заключается в том, что он может обрабатывать вложенные обновления независимо друг от друга. Например, если у нас есть список пользователей в котором обновилось одно имя, то Solid обновит лишь одно место в DOM не перерендеривая весь список. Очень немногие (даже реактивные) UI-фреймворки могут это сделать.

Как мы этого добились? Давайте рассмотрим это на примере списка задач в Сигнале. Чтобы пометить задачу как выполненную, нам нужно заменить ее клоном. Несмотря на то, что так работает большинство фреймворков, это далеко от ресурсоэффективного подхода, поскольку мы повторно запускаем алгоритм вычисления различий (`diffing algorithm`) и воссоздаем элементы DOM, как показано в `console.log`.

```js
const toggleTodo = (id) => {
  setTodos(
    todos().map((todo) => (todo.id !== id ? todo : { ...todo, completed: !todo.completed })),
  );
};
```

Вместо этого в библиотеке с точной реактивностью, такой как Solid, мы инициализируем данные вложенными Сигналами следующим образом:

```js
const addTodo = (text) => {
  const [completed, setCompleted] = createSignal(false);
  setTodos([...todos(), { id: ++todoId, text, completed, setCompleted }]);
};
```

Теперь мы можем обновить данные с помощью вызова `setCompleted` без вычисления различий. Это возможно потому, что мы перенесли вычисления на уровень данных, вместо вычислений на уровне элементов DOM. Такой подход позволяет точно знать каким образом данные изменяются.

```js
const toggleTodo = (id) => {
  const index = todos().findIndex((t) => t.id === id);
  const todo = todos()[index];
  if (todo) todo.setCompleted(!todo.completed())
}
```

Если мы изменим все оставшиеся ссылки с `todo.completed` на Сигналы `todo.completed()`, то мы будем видеть вызов `console.log` только при создании элемента, а не при переключении.

Безусловно, это требует ручного контроля и понимания как устроена ваши данные и недалеком прошлом это был единственный способ добиться эффективного рендеринга в прошлом. Но теперь, благодаря прокси мы можем выполнять большую часть этой работы в фоновом режиме без какой-либо ручной работы. В следующих главах мы рассмотрим механизм, позволяющий Solid реализовать эффективную и точную систему обновлений.