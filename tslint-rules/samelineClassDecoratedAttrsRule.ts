import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Class decorated attrs must be declared on the same line';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoClassDecoratedAttrsOnTheSameLine(sourceFile, this.getOptions()));
  }
}

class NoClassDecoratedAttrsOnTheSameLine extends Lint.RuleWalker {
  public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
    const nodeText = node.getText();
    if (nodeText.indexOf('@') === 0) {
      /* Check decorator declaration seems like:
       * @decoratorName([param|none]) [private |static |public |none]name[!|?|none]: type[none|assignment];
       */
      if (nodeText.match(/@[a-zA-Z]*\(.*\) [a-zA-Z0-9 ]*(!|\?)?: [a-zA-Z]+.*;/)) {
        return super.visitPropertyDeclaration(node);
      }

      const nodeStart = node.name.getStart();
      const nodeWidth = node.name.getWidth();

      this.addFailureAt(nodeStart, nodeWidth, `${Rule.FAILURE_STRING}\n`);
      return super.visitPropertyDeclaration(node);
    }

    super.visitPropertyDeclaration(node);
  }
}
