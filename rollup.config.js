import vue from 'rollup-plugin-vue';
import typescript from 'rollup-plugin-typescript2';

export function getDefaultConfig(pkg) {
  return {
    input: './src/index.ts',
    output: [
      {
        file: pkg.module,
        format: 'esm',
      },
      {
        file: pkg.main,
        format: 'umd',
        name: pkg.name,
        exports: 'named',
        globals: getGlobals(pkg.dependencies),
      },
    ],
    external: Object.keys(pkg.dependencies),
    plugins: [
      vue({
        css: true,
        defaultLang: {
          script: 'ts',
          style: 'scss'
        }
      }),
      typescript({
        clean: true,
        useTsconfigDeclarationDir: true
      }),
    ],
  }
};

function getGlobals(dependencies) {
  let obj = {};
  for (let key in dependencies) {
    obj[key] = key;
  }
  return obj;
}
