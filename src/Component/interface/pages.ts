export interface Pokemon {
    name: string;
    sprite: string;
    id: number;
    stats: { base_stat: number; stat: { name: string } }[];
    types: { type: { name: string } }[];
    abilities: { ability: { name: string } }[];
    height: number;
    weight: number;
}

export interface PokemonData {
    name: string;
    sprite: string;
    id: number;
    stats: any[];
    types: any[];
    abilities: any[];
    height: number;
    weight: number;
}

export interface WildSceneProps {
    onConfirmCatch: (p: Pokemon[]) => void;
}
