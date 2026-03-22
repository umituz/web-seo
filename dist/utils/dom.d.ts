export interface MetaTag {
    name?: string;
    property?: string;
    content: string;
}
export interface SEOptions {
    title?: string;
    description?: string;
    lang?: string;
    canonical?: string;
    meta?: MetaTag[];
    openGraph?: {
        type?: string;
        url?: string;
        title?: string;
        description?: string;
        image?: string;
    };
    twitter?: {
        cardType?: string;
        site?: string;
        handle?: string;
    };
}
export declare const updateSEO: (options: SEOptions) => void;
//# sourceMappingURL=dom.d.ts.map