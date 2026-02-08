export type Profile = {
    id: number;
    name: string;
    pictureUrl: string;
};

export type Couple = {
    id: number;
    profile1: Profile;
    profile2: Profile;
};

export type CoupleProfileIndex = 1 | 2;
