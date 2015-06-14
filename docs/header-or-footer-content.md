# Providing header or footer content

## Header

By default, the content of a multi step container directive will be transcluded inside its
header element.

     <multi-step-form steps="yourSteps">Header content</multi-step-form>

Will result in:

    <section class="multi-step-container">
        <header class="multi-step-header" multi-step-control-element>
            Header content
        </header>

        <article class="multi-step-body" form-step-container></article>
    </section>


## Footer

For using a footer, simply add `use-footer` as an attribute

     <multi-step-form steps="yourSteps" use-footer>Footer content</multi-step-form>

Will result in:

    <section class="multi-step-container">
        <article class="multi-step-body" form-step-container></article>

        <footer class="multi-step-footer" multi-step-control-element>
            Footer content
        </footer>
    </section>
