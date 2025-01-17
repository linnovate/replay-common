/* eslint-disable spaced-comment */

module.exports = {
	'extends': 'google',

	'installedESLint': true,

	'globals': {
		'jQuery': true,
		'$': true,
		'_': true,
		'sails': true,
		'expect': true
	},

	'env': {
		'browser': true,
		'node': true,
		'mongo': true,
		'mocha': true
	},
	'rules': {
		//////////  Felix Geisendörfer //////////
		'array-bracket-spacing': [2, 'never'],
		'block-scoped-var': 2,
		'brace-style': [2, '1tbs'],
		// 'camelcase': 1,
		'computed-property-spacing': [2, 'never'],
		'curly': 2,
		'eol-last': 2,
		'eqeqeq': [2, 'smart'],
		// 'max-depth': [1, 3],
		// 'max-len': [1, 80],
		// 'max-statements': [1, 15],
		// 'new-cap': 1,
		'no-extend-native': 2,
		'no-mixed-spaces-and-tabs': 2,
		'no-trailing-spaces': 2,
		// 'no-unused-vars': 1,
		'no-use-before-define': [2, 'nofunc'],
		// 'object-curly-spacing': [2, 'never'],
		'quotes': [2, 'single', 'avoid-escape'],
		'semi': [2, 'always'],
		'keyword-spacing': [2, { 'before': true, 'after': true }],
		'space-unary-ops': 2,
		//////////////////////////////////////////////////

		'max-depth': ['warn', 4],
		'max-len': ['warn', 150],
		'max-statements': ['warn', 20],
		'padded-blocks': ['warn', { 'blocks': 'never', 'switches': 'never', 'classes': 'always' }],
		'arrow-parens': ['error', 'always'],
		'camelcase': 'error',
		'new-cap': 'error',
		'no-unused-vars': 'error',
		'quote-props': ['error', 'consistent'],
		'indent': ['error', 'tab', { 'SwitchCase': 1 }],
		'handle-callback-err': ['error', '^(.*(e|E)rr|.*(e|E)rror)$'],
		// 'brace-style': ['error', 'stroustrup', { 'allowSingleLine': true }],
		'func-names': 'off',
		'no-console': 'off',
		'object-curly-spacing': 'off',
		'space-before-function-paren': 'off',
		'valid-jsdoc': 'off',
		'require-jsdoc': ['off', {
			'require': {
				'FunctionDeclaration': false,
				'MethodDefinition': false,
				'ClassDeclaration': false
			}
		}],
		'one-var': 'off',
		// 'one-var': ['warn', {
		// 	'var': 'always', // Exactly one var declaration per function
		// 	'let': 'always', // Exactly one let declaration per block
		// 	'const': 'never' // Exactly one declarator per const declaration per block
		// }],
		// 'one-var': ['warn', {
		// 	'uninitialized': 'always', // Exactly one declaration for uninitialized variables per function (var) or block (let or const)
		// 	'initialized': 'always' // Exactly one declarator per initialized variable declaration per function (var) or block (let or const)
		// }],
		'one-var-declaration-per-line': ['warn', 'initializations'],
		'spaced-comment': ['warn', 'always', {
			'line': {
				'markers': ['/'],
				'exceptions': ['-', '+']
			},
			'block': {
				'markers': ['!'],
				'exceptions': ['*'],
				'balanced': false
			}
		}]
	}
};
