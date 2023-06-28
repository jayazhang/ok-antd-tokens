import * as fs from 'fs';
import * as path from 'path';
import tokens from '../src/tokens/tokens.json';
import dark from '../src/tokens/dark.json';
import light from '../src/tokens/light.json';

const options = { encoding: 'utf8' } as any;

type Tokens = typeof tokens;

type AliasKeys = keyof Tokens['dark/alias'];

function resolve(name: string) {
    return path.resolve(__dirname, '../', `src/tokens/${name}.json`)
}

async function readJson(name: string) {
    const text = await fs.readFileSync(resolve(name), options);
    return JSON.parse(text as unknown as string);
}

async function run() {
    const themeList = ['light', 'dark'];
    const toBeGeneratedList = ['alias'];
    const result: any = {};

    for (let i = 0; i < themeList.length; i++) {
        const theme = themeList[i];
        if (theme === 'light') {
            result[theme] = {
                ...light,
            };
        } else {
            result[theme] = {
                ...dark,
            };
        }
        
        for (let j = 0; j < toBeGeneratedList.length; j++) {
            const toBeGenerated = toBeGeneratedList[j];
            const toBeConfirmed = (tokens as any)[`${theme}/${toBeGenerated}`] as Tokens['dark/alias'];
            // console.log(toBeConfirmed, 'toBeConfirmed');
            // console.log(`${theme}/${toBeGenerated}`, '`${theme}/${toBeGenerated}`');
            const keys = Object.keys(toBeConfirmed) as unknown as AliasKeys;
            for (let k = 0; k < keys.length; k++) {
                const key = keys[k] as AliasKeys;
                if (!(light as any)[key] && typeof ((toBeConfirmed as any)[key] as any)?.value === 'string') {
                    // console.log(key);
                    // console.log(toBeConfirmed[key]);
                    const regRes = toBeConfirmed[key].value.match(/\{(.+?)\}/);
                    if (regRes && regRes[1]) {
                        if (result[theme][regRes[1]]) {
                            console.log(key, result[theme][regRes[1]]);
                            result[theme][key] = result[theme][regRes[1]];
                        }
                    }

                }
            }
        }
        const fontFamilyKey = 'fontFamily';
        const fontFamilyInTokens = tokens['light/seed'][fontFamilyKey];
        if (!result[theme][fontFamilyKey].includes(fontFamilyInTokens.value)) {
            result[theme][fontFamilyKey] = `${fontFamilyInTokens.value}, ${result[theme][fontFamilyKey] || ''}`
        }
        await fs.writeFileSync(resolve(theme), JSON.stringify(result[theme], null, 2), options);
    }

}

run();
