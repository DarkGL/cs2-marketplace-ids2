export interface CSGOAPIResponse {
    [key: string]: CSGOAPIResponseItem;
}

export interface CSGOAPIResponseItem {
    id: string;
    name: string;
    description?: null | string;
    rarity?: Rarity;
    collections?: Collection[];
    team?: Category;
    market_hash_name?: null | string;
    image: string;
    model_player?: null | string;
    type?: Type | null;
    genuine?: boolean;
    crates?: Collection[];
    contains?: Contain[];
    first_sale_date?: null | string;
    contains_rare?: Contain[];
    rental?: boolean;
    special_notes?: SpecialNote[];
    exclusive?: boolean;
    skin_id?: string;
    weapon?: Category;
    category?: Category;
    pattern?: Pattern;
    min_float?: number;
    max_float?: number;
    wear?: Category;
    stattrak?: boolean;
    souvenir?: boolean;
    paint_index?: string;
    phase?: Phase;
    tournament_event?: TournamentEvent;
    effect?: Effect;
    tournament_team?: string;
    tournament_player?: string;
}

export interface Category {
    id: CategoryID | null;
    name: CategoryName | null;
}

export type CategoryID =
    | 'csgo_inventory_weapon_category_pistols'
    | 'csgo_inventory_weapon_category_rifles'
    | 'csgo_inventory_weapon_category_heavy'
    | 'csgo_inventory_weapon_category_smgs'
    | 'sfui_invpanel_filter_melee'
    | 'sfui_invpanel_filter_gloves'
    | 'terrorists'
    | 'counter-terrorists'
    | 'both'
    | 'weapon_deagle'
    | 'weapon_elite'
    | 'weapon_fiveseven'
    | 'weapon_glock'
    | 'weapon_ak47'
    | 'weapon_aug'
    | 'weapon_awp'
    | 'weapon_famas'
    | 'weapon_g3sg1'
    | 'weapon_galilar'
    | 'weapon_m249'
    | 'weapon_m4a1'
    | 'weapon_mac10'
    | 'weapon_p90'
    | 'weapon_mp5sd'
    | 'weapon_ump45'
    | 'weapon_xm1014'
    | 'weapon_bizon'
    | 'weapon_mag7'
    | 'weapon_negev'
    | 'weapon_sawedoff'
    | 'weapon_tec9'
    | 'weapon_taser'
    | 'weapon_hkp2000'
    | 'weapon_mp7'
    | 'weapon_mp9'
    | 'weapon_nova'
    | 'weapon_p250'
    | 'weapon_scar20'
    | 'weapon_sg556'
    | 'weapon_ssg08'
    | 'weapon_m4a1_silencer'
    | 'weapon_usp_silencer'
    | 'weapon_cz75a'
    | 'weapon_revolver'
    | 'weapon_bayonet'
    | 'weapon_knife_css'
    | 'weapon_knife_flip'
    | 'weapon_knife_gut'
    | 'weapon_knife_karambit'
    | 'weapon_knife_m9_bayonet'
    | 'weapon_knife_tactical'
    | 'weapon_knife_falchion'
    | 'weapon_knife_survival_bowie'
    | 'weapon_knife_butterfly'
    | 'weapon_knife_push'
    | 'weapon_knife_cord'
    | 'weapon_knife_canis'
    | 'weapon_knife_ursus'
    | 'weapon_knife_gypsy_jackknife'
    | 'weapon_knife_outdoor'
    | 'weapon_knife_stiletto'
    | 'weapon_knife_widowmaker'
    | 'weapon_knife_skeleton'
    | 'weapon_knife_kukri'
    | 'studded_brokenfang_gloves'
    | 'studded_bloodhound_gloves'
    | 'sporty_gloves'
    | 'slick_gloves'
    | 'leather_handwraps'
    | 'motorcycle_gloves'
    | 'specialist_gloves'
    | 'studded_hydra_gloves'
    | 'sfui_wpnhud_knifebayonet'
    | 'sfui_wpnhud_knifecss'
    | 'sfui_wpnhud_knifeflip'
    | 'sfui_wpnhud_knifegut'
    | 'sfui_wpnhud_knifekaram'
    | 'sfui_wpnhud_knifem9'
    | 'sfui_wpnhud_knifetactical'
    | 'sfui_wpnhud_knife_falchion_advanced'
    | 'sfui_wpnhud_knife_survival_bowie'
    | 'sfui_wpnhud_knife_butterfly'
    | 'sfui_wpnhud_knife_push'
    | 'sfui_wpnhud_knife_cord'
    | 'sfui_wpnhud_knife_canis'
    | 'sfui_wpnhud_knife_ursus'
    | 'sfui_wpnhud_knife_gypsy_jackknife'
    | 'sfui_wpnhud_knife_outdoor'
    | 'sfui_wpnhud_knife_stiletto'
    | 'sfui_wpnhud_knife_widowmaker'
    | 'sfui_wpnhud_knife_skeleton'
    | 'sfui_wpnhud_knife_kukri'
    | 'SFUI_InvTooltip_Wear_Amount_0'
    | 'SFUI_InvTooltip_Wear_Amount_1'
    | 'SFUI_InvTooltip_Wear_Amount_2'
    | 'SFUI_InvTooltip_Wear_Amount_3'
    | 'SFUI_InvTooltip_Wear_Amount_4';

export type CategoryName =
    | 'Pistols'
    | 'Rifles'
    | 'Heavy'
    | 'SMGs'
    | 'Knives'
    | 'Gloves'
    | 'Terrorist'
    | 'Counter-Terrorist'
    | 'Both Teams'
    | 'Desert Eagle'
    | 'Dual Berettas'
    | 'Five-SeveN'
    | 'Glock-18'
    | 'AK-47'
    | 'AUG'
    | 'AWP'
    | 'FAMAS'
    | 'G3SG1'
    | 'Galil AR'
    | 'M249'
    | 'M4A4'
    | 'MAC-10'
    | 'P90'
    | 'MP5-SD'
    | 'UMP-45'
    | 'XM1014'
    | 'PP-Bizon'
    | 'MAG-7'
    | 'Negev'
    | 'Sawed-Off'
    | 'Tec-9'
    | 'Zeus x27'
    | 'P2000'
    | 'MP7'
    | 'MP9'
    | 'Nova'
    | 'P250'
    | 'SCAR-20'
    | 'SG 553'
    | 'SSG 08'
    | 'M4A1-S'
    | 'USP-S'
    | 'CZ75-Auto'
    | 'R8 Revolver'
    | 'Bayonet'
    | 'Classic Knife'
    | 'Flip Knife'
    | 'Gut Knife'
    | 'Karambit'
    | 'M9 Bayonet'
    | 'Huntsman Knife'
    | 'Falchion Knife'
    | 'Bowie Knife'
    | 'Butterfly Knife'
    | 'Shadow Daggers'
    | 'Paracord Knife'
    | 'Survival Knife'
    | 'Ursus Knife'
    | 'Navaja Knife'
    | 'Nomad Knife'
    | 'Stiletto Knife'
    | 'Talon Knife'
    | 'Skeleton Knife'
    | 'Kukri Knife'
    | 'Broken Fang Gloves'
    | 'Bloodhound Gloves'
    | 'Sport Gloves'
    | 'Driver Gloves'
    | 'Hand Wraps'
    | 'Moto Gloves'
    | 'Specialist Gloves'
    | 'Hydra Gloves'
    | 'Factory New'
    | 'Minimal Wear'
    | 'Field-Tested'
    | 'Well-Worn'
    | 'Battle-Scarred';

export interface Collection {
    id: string;
    name: string;
    image: string;
}

export interface Contain {
    id: string;
    name: string;
    rarity: Rarity;
    paint_index?: null | string;
    image: string;
    phase?: Phase | null;
}

export type Phase =
    | 'Phase 4'
    | 'Phase 3'
    | 'Phase 2'
    | 'Phase 1'
    | 'Emerald'
    | 'Ruby'
    | 'Sapphire'
    | 'Black Pearl';

export interface Rarity {
    id: RarityID;
    name: RarityName;
    color: Color;
}

export type Color =
    | '#4b69ff'
    | '#8847ff'
    | '#d32ce6'
    | '#eb4b4b'
    | '#5e98d9'
    | '#b0c3d9'
    | '#e4ae39'
    | '#ded6cc';

export type RarityID =
    | 'rarity_rare_weapon'
    | 'rarity_mythical_weapon'
    | 'rarity_legendary_weapon'
    | 'rarity_ancient_weapon'
    | 'rarity_uncommon_weapon'
    | 'rarity_common_weapon'
    | 'rarity_ancient_character'
    | 'rarity_legendary_character'
    | 'rarity_mythical_character'
    | 'rarity_rare_character'
    | 'rarity_common'
    | 'rarity_rare'
    | 'rarity_mythical'
    | 'rarity_legendary'
    | 'rarity_ancient'
    | 'rarity_contraband_weapon'
    | 'rarity_default'
    | 'rarity_contraband';

export type RarityName =
    | 'Mil-Spec Grade'
    | 'Restricted'
    | 'Classified'
    | 'Covert'
    | 'Industrial Grade'
    | 'Consumer Grade'
    | 'Master'
    | 'Superior'
    | 'Exceptional'
    | 'Distinguished'
    | 'Base Grade'
    | 'High Grade'
    | 'Remarkable'
    | 'Exotic'
    | 'Extraordinary'
    | 'Contraband'
    | 'Default';

export type Effect = 'Other' | 'Foil' | 'Holo' | 'Gold' | 'Glitter' | 'Lenticular';

export interface Pattern {
    id: string;
    name: number | string;
}

export interface SpecialNote {
    source: string;
    text: string;
}

export type TournamentEvent =
    | 'DreamHack 2013'
    | 'Katowice 2014'
    | 'Cologne 2014'
    | 'DreamHack 2014'
    | 'Katowice 2015'
    | 'Cologne 2015'
    | 'Cluj-Napoca 2015'
    | 'Columbus 2016'
    | 'Cologne 2016'
    | 'Atlanta 2017'
    | 'Krakow 2017'
    | 'Boston 2018'
    | 'London 2018'
    | 'Katowice 2019'
    | 'Berlin 2019'
    | 'RMR 2020'
    | 'Stockholm 2021'
    | 'Antwerp 2022'
    | 'Rio 2022'
    | 'Paris 2023'
    | 'Copenhagen 2024';

export type Type =
    | 'Tournament Finalist Trophy'
    | "Old Pick'Em Trophy"
    | 'Fantasy Trophy'
    | 'Pass'
    | 'Operation Coin'
    | 'Map Contributor Coin'
    | 'Service Medal'
    | "Pick'Em Coin"
    | 'Stars for Operation'
    | 'Pin'
    | 'Case'
    | 'Souvenir'
    | 'Sticker Capsule'
    | 'Autograph Capsule'
    | 'Graffiti'
    | 'Pins'
    | 'Music Kit Box'
    | 'Patch Capsule'
    | 'Event'
    | 'Other'
    | 'Team'
    | 'Autograph';
