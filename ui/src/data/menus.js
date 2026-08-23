export const MENUS = [
  {
    id: 'americano-ice',
    name: '아메리카노(ICE)',
    image: '/menus/americano-ice.png',
    price: 4000,
    stock: 10,
    description: '얼음과 함께 시원하게 즐기는 아메리카노',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 },
    ],
  },
  {
    id: 'americano-hot',
    name: '아메리카노(HOT)',
    image: '/menus/americano-hot.png',
    price: 4000,
    stock: 10,
    description: '에스프레소에 뜨거운 물을 더한 아메리카노',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 },
    ],
  },
  {
    id: 'cafe-latte',
    name: '카페라떼',
    image: '/menus/cafe-latte.png',
    price: 5000,
    stock: 10,
    description: '진한 에스프레소와 부드러운 우유의 조화',
    options: [
      { id: 'shot', name: '샷 추가', price: 500 },
      { id: 'syrup', name: '시럽 추가', price: 0 },
    ],
  },
]
