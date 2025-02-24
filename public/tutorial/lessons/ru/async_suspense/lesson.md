Несмотря на то, что `lazy` и `createResource` могут быть использованы независимо, Solid имеет механизм для координации нескольких асинхронных событий. `Suspense` позволяет нам показывать заглушку (`fallback`), до тех пор пока мы полностью не выполним асинхронные события в нашем компоненте.

Это может улучшить пользовательский опыт, так как убирает лишнюю визуализацию данных в пограничных состояниях загрузки и скачки контента. `Suspense` автоматически определяет все асинхронные чтения и координирует отрисовку. Вы можете использовать неограниченное количество `Suspense` компонентов в вашем коде и только ближайший будет использовать заглушку, когда Solid найдет ближайший `loading` Сигнал. 

Давайте добавим компонент `Suspense` в наш пример с ленивой загрузкой (`lazy loading`):

```jsx
<>
  <h1>Welcome</h1>
  <Suspense fallback={<p>Loading...</p>}>
    <Greeting name="Jake" />
  </Suspense>
</>
```

Теперь при загрузке мы увидим нашу заглушку.

Очень важно понимать, что именно чтение асинхронного значения включает `Suspense` в работу, а не сам факт запуска асинхронной операции. Если Ресурс (включая `lazy` компоненты) не имеет чтения внутри `Suspense`, то он не будет активирован.

`Suspense` можно представить как `Show` компонент, который показывает обе ветки. Несмотря на то, что `Suspense` является обязательным для асинхронного выполнения на сервере (`server rendering`), если вы используете Solid только для рендеринга на стороне клиента (`client rendering`), то использование `Suspense` можно отложить. Модель реактивности Solid позволяет нам разбивать наше приложение на любое количество файлов не увеличивая затрат по ресурсам.

```jsx
function Deferred(props) {
  const [resume, setResume] = createSignal(false);
  setTimeout(() => setResume(true), 0);

  return <Show when={resume()}>{props.children}</Show>;
}
```

Вся работа в Solid запускается независимо друг от друга изначально, поэтому в вещах вроде [Time Slicing](https://ru.reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html) нет необходимости.
