# Providing header content

The content of a multi step container directive will be transcluded inside its
header element.

     <multi-step-form steps="yourSteps">Header content</multi-step-form>

Will result in:

    <section class="multi-step-container">
        <header class="multi-step-header" multi-step-header>
            Header content
        </header>

        <article class="multi-step-body" form-step-container></article>
    </section>
