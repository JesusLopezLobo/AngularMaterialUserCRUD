/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class _Visitor {
    visitTag(tag) {
        const strAttrs = this._serializeAttributes(tag.attrs);
        if (tag.children.length == 0) {
            return `<${tag.name}${strAttrs}/>`;
        }
        const strChildren = tag.children.map(node => node.visit(this));
        return `<${tag.name}${strAttrs}>${strChildren.join('')}</${tag.name}>`;
    }
    visitText(text) {
        return text.value;
    }
    visitDeclaration(decl) {
        return `<?xml${this._serializeAttributes(decl.attrs)} ?>`;
    }
    _serializeAttributes(attrs) {
        const strAttrs = Object.keys(attrs).map((name) => `${name}="${attrs[name]}"`).join(' ');
        return strAttrs.length > 0 ? ' ' + strAttrs : '';
    }
    visitDoctype(doctype) {
        return `<!DOCTYPE ${doctype.rootTag} [\n${doctype.dtd}\n]>`;
    }
}
const _visitor = new _Visitor();
export function serialize(nodes) {
    return nodes.map((node) => node.visit(_visitor)).join('');
}
export class Declaration {
    constructor(unescapedAttrs) {
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach((k) => {
            this.attrs[k] = escapeXml(unescapedAttrs[k]);
        });
    }
    visit(visitor) {
        return visitor.visitDeclaration(this);
    }
}
export class Doctype {
    constructor(rootTag, dtd) {
        this.rootTag = rootTag;
        this.dtd = dtd;
    }
    visit(visitor) {
        return visitor.visitDoctype(this);
    }
}
export class Tag {
    constructor(name, unescapedAttrs = {}, children = []) {
        this.name = name;
        this.children = children;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach((k) => {
            this.attrs[k] = escapeXml(unescapedAttrs[k]);
        });
    }
    visit(visitor) {
        return visitor.visitTag(this);
    }
}
export class Text {
    constructor(unescapedValue) {
        this.value = escapeXml(unescapedValue);
    }
    visit(visitor) {
        return visitor.visitText(this);
    }
}
export class CR extends Text {
    constructor(ws = 0) {
        super(`\n${new Array(ws + 1).join(' ')}`);
    }
}
const _ESCAPED_CHARS = [
    [/&/g, '&amp;'],
    [/"/g, '&quot;'],
    [/'/g, '&apos;'],
    [/</g, '&lt;'],
    [/>/g, '&gt;'],
];
// Escape `_ESCAPED_CHARS` characters in the given text with encoded entities
export function escapeXml(text) {
    return _ESCAPED_CHARS.reduce((text, entry) => text.replace(entry[0], entry[1]), text);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sX2hlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pMThuL3NlcmlhbGl6ZXJzL3htbF9oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBU0gsTUFBTSxRQUFRO0lBQ1osUUFBUSxDQUFDLEdBQVE7UUFDZixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRELElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQzVCLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLFFBQVEsSUFBSSxDQUFDO1NBQ3BDO1FBRUQsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDL0QsT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxTQUFTLENBQUMsSUFBVTtRQUNsQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELGdCQUFnQixDQUFDLElBQWlCO1FBQ2hDLE9BQU8sUUFBUSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDNUQsQ0FBQztJQUVPLG9CQUFvQixDQUFDLEtBQTRCO1FBQ3ZELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBWSxFQUFFLEVBQUUsQ0FBQyxHQUFH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TyxDQUFDO0lBQ2YsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO0lBQ2hCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztJQUNoQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7SUFDZCxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7Q0FDZixDQUFDO0FBRUYsNkVBQTZFO0FBQzdFLE1BQU0sVUFBVSxTQUFTLENBQUMsSUFBWTtJQUNwQyxPQUFPLGNBQWMsQ0FBQyxNQUFNLENBQ3hCLENBQUMsSUFBWSxFQUFFLEtBQXVCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBJVmlzaXRvciB7XG4gIHZpc2l0VGFnKHRhZzogVGFnKTogYW55O1xuICB2aXNpdFRleHQodGV4dDogVGV4dCk6IGFueTtcbiAgdmlzaXREZWNsYXJhdGlvbihkZWNsOiBEZWNsYXJhdGlvbik6IGFueTtcbiAgdmlzaXREb2N0eXBlKGRvY3R5cGU6IERvY3R5cGUpOiBhbnk7XG59XG5cbmNsYXNzIF9WaXNpdG9yIGltcGxlbWVudHMgSVZpc2l0b3Ige1xuICB2aXNpdFRhZyh0YWc6IFRhZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RyQXR0cnMgPSB0aGlzLl9zZXJpYWxpemVBdHRyaWJ1dGVzKHRhZy5hdHRycyk7XG5cbiAgICBpZiAodGFnLmNoaWxkcmVuLmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4gYDwke3RhZy5uYW1lfSR7c3RyQXR0cnN9Lz5gO1xuICAgIH1cblxuICAgIGNvbnN0IHN0ckNoaWxkcmVuID0gdGFnLmNoaWxkcmVuLm1hcChub2RlID0+IG5vZGUudmlzaXQodGhpcykpO1xuICAgIHJldHVybiBgPCR7dGFnLm5hbWV9JHtzdHJBdHRyc30+JHtzdHJDaGlsZHJlbi5qb2luKCcnKX08LyR7dGFnLm5hbWV9PmA7XG4gIH1cblxuICB2aXNpdFRleHQodGV4dDogVGV4dCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRleHQudmFsdWU7XG4gIH1cblxuICB2aXNpdERlY2xhcmF0aW9uKGRlY2w6IERlY2xhcmF0aW9uKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYDw/eG1sJHt0aGlzLl9zZXJpYWxpemVBdHRyaWJ1dGVzKGRlY2wuYXR0cnMpfSA/PmA7XG4gIH1cblxuICBwcml2YXRlIF9zZXJpYWxpemVBdHRyaWJ1dGVzKGF0dHJzOiB7W2s6IHN0cmluZ106IHN0cmluZ30pIHtcbiAgICBjb25zdCBzdHJBdHRycyA9IE9iamVjdC5rZXlzKGF0dHJzKS5tYXAoKG5hbWU6IHN0cmluZykgPT4gYCR7bmFtZX09XCIke2F0dHJzW25hbWVdfVwiYCkuam9pbignICcpO1xuICAgIHJldHVybiBzdHJBdHRycy5sZW5ndGggPiAwID8gJyAnICsgc3RyQXR0cnMgOiAnJztcbiAgfVxuXG4gIHZpc2l0RG9jdHlwZShkb2N0eXBlOiBEb2N0eXBlKTogYW55IHtcbiAgICByZXR1cm4gYDwhRE9DVFlQRSAke2RvY3R5cGUucm9vdFRhZ30gW1xcbiR7ZG9jdHlwZS5kdGR9XFxuXT5gO1xuICB9XG59XG5cbmNvbnN0IF92aXNpdG9yID0gbmV3IF9WaXNpdG9yKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemUobm9kZXM6IE5vZGVbXSk6IHN0cmluZyB7XG4gIHJldHVybiBub2Rlcy5tYXAoKG5vZGU6IE5vZGUpOiBzdHJpbmcgPT4gbm9kZS52aXNpdChfdmlzaXRvcikpLmpvaW4oJycpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5vZGUge1xuICB2aXNpdCh2aXNpdG9yOiBJVmlzaXRvcik6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIERlY2xhcmF0aW9uIGltcGxlbWVudHMgTm9kZSB7XG4gIHB1YmxpYyBhdHRyczoge1trOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgY29uc3RydWN0b3IodW5lc2NhcGVkQXR0cnM6IHtbazogc3RyaW5nXTogc3RyaW5nfSkge1xuICAgIE9iamVjdC5rZXlzKHVuZXNjYXBlZEF0dHJzKS5mb3JFYWNoKChrOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMuYXR0cnNba10gPSBlc2NhcGVYbWwodW5lc2NhcGVkQXR0cnNba10pO1xuICAgIH0pO1xuICB9XG5cbiAgdmlzaXQodmlzaXRvcjogSVZpc2l0b3IpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGVjbGFyYXRpb24odGhpcyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvY3R5cGUgaW1wbGVtZW50cyBOb2RlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJvb3RUYWc6IHN0cmluZywgcHVibGljIGR0ZDogc3RyaW5nKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IElWaXNpdG9yKTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdERvY3R5cGUodGhpcyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRhZyBpbXBsZW1lbnRzIE5vZGUge1xuICBwdWJsaWMgYXR0cnM6IHtbazogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIG5hbWU6IHN0cmluZywgdW5lc2NhcGVkQXR0cnM6IHtbazogc3RyaW5nXTogc3RyaW5nfSA9IHt9LFxuICAgICAgcHVibGljIGNoaWxkcmVuOiBOb2RlW10gPSBbXSkge1xuICAgIE9iamVjdC5rZXlzKHVuZXNjYXBlZEF0dHJzKS5mb3JFYWNoKChrOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMuYXR0cnNba10gPSBlc2NhcGVYbWwodW5lc2NhcGVkQXR0cnNba10pO1xuICAgIH0pO1xuICB9XG5cbiAgdmlzaXQodmlzaXRvcjogSVZpc2l0b3IpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGFnKHRoaXMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGltcGxlbWVudHMgTm9kZSB7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHVuZXNjYXBlZFZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLnZhbHVlID0gZXNjYXBlWG1sKHVuZXNjYXBlZFZhbHVlKTtcbiAgfVxuXG4gIHZpc2l0KHZpc2l0b3I6IElWaXNpdG9yKTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFRleHQodGhpcyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENSIGV4dGVuZHMgVGV4dCB7XG4gIGNvbnN0cnVjdG9yKHdzOiBudW1iZXIgPSAwKSB7XG4gICAgc3VwZXIoYFxcbiR7bmV3IEFycmF5KHdzICsgMSkuam9pbignICcpfWApO1xuICB9XG59XG5cbmNvbnN0IF9FU0NBUEVEX0NIQVJTOiBbUmVnRXhwLCBzdHJpbmddW10gPSBbXG4gIFsvJi9nLCAnJmFtcDsnXSxcbiAgWy9cIi9nLCAnJnF1b3Q7J10sXG4gIFsvJy9nLCAnJmFwb3M7J10sXG4gIFsvPC9nLCAnJmx0OyddLFxuICBbLz4vZywgJyZndDsnXSxcbl07XG5cbi8vIEVzY2FwZSBgX0VTQ0FQRURfQ0hBUlNgIGNoYXJhY3RlcnMgaW4gdGhlIGdpdmVuIHRleHQgd2l0aCBlbmNvZGVkIGVudGl0aWVzXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlWG1sKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBfRVNDQVBFRF9DSEFSUy5yZWR1Y2UoXG4gICAgICAodGV4dDogc3RyaW5nLCBlbnRyeTogW1JlZ0V4cCwgc3RyaW5nXSkgPT4gdGV4dC5yZXBsYWNlKGVudHJ5WzBdLCBlbnRyeVsxXSksIHRleHQpO1xufVxuIl19