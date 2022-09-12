export class Gamification {
  // id: string;
  levels: number;
  points: number;
  coins: number;
  badges: {
    badge_id: string;
    // badge_name: string;
    // badge_reward: number;
  };
  items: {
    houses: {
      house_id: string;
      // house_level: number;
      // house_name: string;
      // house_price: number;
      // house_apply: boolean;
      // house_buy: boolean;
    },
    skins: {
      skin_id: string;
      // skin_level: number;
      // skin_name: string;
      // skin_price: number;
      // skin_apply: boolean;
      // skin_buy: boolean;
    },
    accessories: {
      acc_id: string;
      // acc_level: number;
      // acc_name: string;
      // acc_price: number;
      // acc_apply: boolean;
      // acc_buy: boolean;
    },
    toys: {
      toy_id: string;
      // toy_level: number;
      // toy_name: string;
      // toy_price: number;
      // toy_apply: boolean;
      // toy_buy: boolean;
    }
  };
}
