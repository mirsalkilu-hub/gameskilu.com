declare global {
    interface Window {
        ezstandalone?: {
        cmd: Array<() => void>;
        showAds: {
            (options: Record<string, never>): void;
            (...ids: number[]): void;
        };
        destroyPlaceholders: (...ids: number[]) => void;
        };
    }
}
export {};
