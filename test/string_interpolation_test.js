import check from './support/check';

describe('string interpolation', () => {
  it('rewrites interpolations with #{} to ${}', function() {
    check('"a#{b}c"', '`a${b}c`;');
  });

  it('rewrites interpolations with spaces after the "{"', function() {
    check('"a#{ b }c"', '`a${ b }c`;');
  });

  it('can return interpolated strings', function() {
    check('-> "#{a}"', '(function() { return `${a}`; });');
  });

  it('ensures backticks are escaped', () => {
    check('"`#{name}` is required"', '`\\`${name}\\` is required`;');
  });

  it('does not double-escape backticks', () => {
    check('"\\`#{name}\\` is required"', '`\\`${name}\\` is required`;');
  });

  it('handles multi-line triple-quoted strings correctly', () => {
    check('a = """\n     #{b}\n     c\n    """', 'var a = `${b}\nc`;');
  });

  it('handles double quotes inside triple-double quotes', () => {
    check(`
      a="""
      bar="#{bar}"
      """
    `, `
      var a=\`bar="\${bar}"\`;
    `);
  });

  it('handles comments inside interpolations', () => {
    check(`
      a="#{
      b # foo!
      }"
    `, `
      var a=\`\${
      b // foo!
      }\`;
    `);
  });

  it('escapes ${ inside strings that become template strings', () => {
    check(
      '"#{interpolation}${not interpolation}"',
      '`${interpolation}\\${not interpolation}`;'
    );
  });

  it('escapes ${ inside block strings that become template strings', () => {
    check(`
      """
      \${a}
      \${b}
      """
    `, `
      \`\\\${a}
      \\\${b}\`;
    `);
  });
});
