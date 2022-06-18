export class User {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  emailVerified: boolean;
  moodCheckIn: {
    moodId: string;
    date: string;
    currentMood: string;
    currentFeeling: string;
    activities: string[];
    notes: string;
  }
}
