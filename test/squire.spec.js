/*global expect, describe, afterEach, beforeEach, it */
/**
 * The requestAnimationFrame polyfill
 * Paul Irish.
 * {@link http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/}
 */
window._rAF = (function() {
  return window.requestAnimationFrame ||
     window.webkitRequestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     function(callback) {
       window.setTimeout(callback, 16);
     };
})();

expect = expect.clone()
    .addType({
        name: 'SquireRTE',
        base: 'object',
        identify: function (value) {
            return value instanceof Squire;
        },
        inspect: function (value) {
            return 'Squire RTE: ' + value.getHTML();
        }
    })
    .addAssertion('[not] to contain HTML', function (expect, editor, expectedValue) {
        this.errorMode = 'bubble';
        var actualHTML = editor.getHTML().replace(/<br>/g, '');
        // BR tags are inconsistent across browsers. Removing them allows cross-browser testing.
        expect(actualHTML, '[not] to be', expectedValue);
    });

describe('Squire RTE', function () {

    var iframe, doc, editor;

    describe('removeAllFormatting', function () {

        beforeEach(function () {
            iframe = document.createElement('IFRAME');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            doc = iframe.contentDocument;
            editor = new Squire(doc);
        });

        afterEach(() => {
            iframe.parentNode.removeChild(iframe);
        })

        function selectAll(editor, doc) {
            var range = doc.createRange();
            range.setStart(doc.body.childNodes.item(0), 0);
            range.setEnd(doc.body.childNodes.item(0), doc.body.childNodes.item(0).childNodes.length);
            editor.setSelection(range);
        }


        // Trivial cases
        it('removes inline styles', (done) => {
            var startHTML = '<div><i>one</i> <b>two</b> <u>three</u> <sub>four</sub> <sup>five</sup></div>';
            editor.setHTML(startHTML);
            _rAF(() => {
                expect(editor, 'to contain HTML', startHTML);
                selectAll(editor, doc);
                editor.removeAllFormatting();
                expect(editor, 'to contain HTML', '<div>one two three four five</div>');
                done()
            })
        });


        it('removes block styles', (done) => {
            var startHTML = '<div><blockquote>one</blockquote><ul><li>two</li></ul>' +
                '<ol><li>three</li></ol><table><tbody><tr><th>four</th><td>five</td></tr></tbody></table></div>';
            editor.setHTML(startHTML);
            _rAF(() => {
                expect(editor, 'to contain HTML', startHTML);
                selectAll(editor, doc);
                editor.removeAllFormatting();
                var expectedHTML = '<div>one</div><div>two</div><div>three</div><div>four</div><div>five</div>';
                expect(editor, 'to contain HTML', expectedHTML);
                done()
            })
        });

        // Potential bugs
        it('removes styles that begin inside the range', (done) => {
            var startHTML = '<div>one <i>two three four five</i></div>';
            editor.setHTML(startHTML);
            _rAF(() => {
                expect(editor, 'to contain HTML', startHTML);
                var range = doc.createRange();
                range.setStart(doc.body.childNodes.item(0), 0);
                range.setEnd(doc.getElementsByTagName('i').item(0).childNodes.item(0), 4);
                editor.removeAllFormatting(range);
                expect(editor, 'to contain HTML', '<div>one two <i>three four five</i></div>');
                done()
            })
        });

        it('removes styles that end inside the range', (done) => {
            var startHTML = '<div><i>one two three four</i> five</div>';
            editor.setHTML(startHTML);
            _rAF(() => {
                expect(editor, 'to contain HTML', startHTML);
                var range = doc.createRange();
                range.setStart(doc.getElementsByTagName('i').item(0).childNodes.item(0), 13);
                range.setEnd(doc.body.childNodes.item(0), doc.body.childNodes.item(0).childNodes.length);
                editor.removeAllFormatting(range);
                expect(editor, 'to contain HTML', '<div><i>one two three</i> four five</div>');
                done();
            })
        });

        it('removes styles enclosed by the range', (done) => {
            var startHTML = '<div>one <i>two three four</i> five</div>';
            editor.setHTML(startHTML);
            _rAF(() => {
                expect(editor, 'to contain HTML', startHTML);
                var range = doc.createRange();
                range.setStart(doc.body.childNodes.item(0), 0);
                range.setEnd(doc.body.childNodes.item(0), doc.body.childNodes.item(0).childNodes.length);
                editor.removeAllFormatting(range);
                expect(editor, 'to contain HTML', '<div>one two three four five</div>');
                done()
            });
        });

        it('removes styles enclosing the range', (done) => {
            var startHTML = '<div><i>one two three four five</i></div>';
            editor.setHTML(startHTML);
            _rAF(() => {
                expect(editor, 'to contain HTML', startHTML);
                var range = doc.createRange();
                range.setStart(doc.getElementsByTagName('i').item(0).childNodes.item(0), 4);
                range.setEnd(doc.getElementsByTagName('i').item(0).childNodes.item(0), 18);
                editor.removeAllFormatting(range);
                expect(editor, 'to contain HTML', '<div><i>one </i>two three four<i> five</i></div>');
                done()
            })
        });

        it('removes nested styles and closes tags correctly', (done) => {
            var startHTML = '<table><tbody><tr><td>one</td></tr><tr><td>two</td><td>three</td></tr><tr><td>four</td><td>five</td></tr></tbody></table>';
            editor.setHTML(startHTML);
            _rAF(() => {
                expect(editor, 'to contain HTML', startHTML);
                var range = doc.createRange();
                range.setStart(doc.getElementsByTagName('td').item(1), 0);
                range.setEnd(doc.getElementsByTagName('td').item(2), doc.getElementsByTagName('td').item(2).childNodes.length);
                editor.removeAllFormatting(range);
                expect(editor, 'to contain HTML', '<table><tbody><tr><td>one</td></tr></tbody></table>' +
                    '<div>two</div>' +
                    '<div>three</div>' +
                    '<table><tbody><tr><td>four</td><td>five</td></tr></tbody></table>');

                done()
            })
        });
    });

});
