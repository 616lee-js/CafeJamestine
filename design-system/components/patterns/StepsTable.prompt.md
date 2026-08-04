The brew reference. Numeric columns are tabular-nums; missing values are an em dash, and units are always spelled in the cell ("50 g", "3.2 ml/s").

```jsx
<StepsTable steps={[{time:"0:00",description:"Bloom, centre pour",weight:50,flow:null}]} />
<StepsTable mode="specialty_drink" steps={[{description:"Pull 18 g double"}]} />
```

Times are `m:ss` with no leading zero on the minute (`3:45`, `0:30`).
