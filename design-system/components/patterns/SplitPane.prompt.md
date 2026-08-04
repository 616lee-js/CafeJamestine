Intentional addition — the brief replaces the old narrow centred column with list-beside-detail on landscape.

```jsx
<SplitPane list={<CoffeeRail coffees={coffees} selected={id} onSelect={setId} />}>
  <CoffeeReadView coffee={coffee} />
</SplitPane>
```

Selecting in the rail swaps the detail pane; the rail never unmounts. Below 60rem pass `stacked`
so the rail becomes a full-width index above the detail.
