# NASDAQ Whale App

## Discription

NASDAQ Whale App provides quick access to real-time market data (stock quotes). NASDAQ opening time always refers to the beginning of normal hours or 9.30 AM to 4 PM (ET) on all working days. Trading does not happen on Saturdays and Sundays so NASDAQ Whale app won't receive any data at that time. 

## Development

#### How to install:
```bash
$ yarn install
```

#### How to build web app:
```bash
$ yarn start
```

#### How to build a server:
```bash
$ yarn start:server
```

## Technologies
1. `Redux` - for managing and centralizing application state.
2. `React` - used for UI in `content script `and `extension settings popup`.
3. `Visx` - used to build a graphic of weekly usage visualization.
