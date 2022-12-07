export class Items {
  houses: [
    { house_id: string;
      house_apply: boolean;
      house_buy: boolean;
    }
  ];
  skins: [
    { skin_id: string;
      skin_apply: boolean;
      skin_buy: boolean;
    }
  ];
  accessories:
    {  collar:
        {
          acc_id: string;
          acc_apply: boolean,
          acc_buy: boolean
        },
      glasses:
        {
          acc_id: string;
          acc_apply: boolean,
          acc_buy: boolean
        },
      pandora:
        {
          acc_id: string;
          acc_apply: boolean,
          acc_buy: boolean
        },
      bow:
        {
          acc_id: string;
          acc_apply: boolean,
          acc_buy: boolean
        },
    };
  toys: {
    left:
      {
        toy_id: string;
        toy_apply: boolean,
        toy_buy: boolean
      },
    middle:
      {
        toy_id: string;
        toy_apply: boolean,
        toy_buy: boolean
      },
    right:
      {
        toy_id: string;
        toy_apply: boolean,
        toy_buy: boolean
      },
  };
}
