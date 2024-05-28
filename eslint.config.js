import tseslint from 'typescript-eslint';

export default tseslint.config(
    ...tseslint.configs.strict,
    {
        ignores: ['dist/*', 'docs/*'],
    },
    {
        rules: {
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    }
);
