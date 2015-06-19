# Migrating from 1.0.x to 1.1.x

1.1.x gives you now the choice to have a header AND a footer, also provides full control over HTML layout and structure.

### Steps to follow

- Add `step-container` in `multi-step-container` (see below)
- Wrap your headers and / or footers in `<head></head>` and `<footer></footer>`
- Remove `use-footer` attribute

### Note

- The `multi-step-container` and `step-container` directives can be used as elements or attributes, leaving you to decide on the semantics of your HTML.
- If a `step-container` is not supplied, an error will be thrown

## Differences between 1.0.x and 1.1.x

### With 1.1+

There is now no transclusion happening anymore, leaving you full control on markup structure.

```html
<multi-step-container steps="steps">
    This my header content

    <step-container></multi-step-container>

    This is my footer content
</multi-step-container>
```

Will result in:

```html
<multi-step-container class="multi-step-container" steps="steps">
    This my header content

    <step-container class="multi-step-body">
        <div class="form-step">
            <!-- The current step -->
        </div>
    </step-container>

    This my footer content
</multi-step-container >
```

### With 1.0.x

Prior to 1.1, the content of `multi-step-container` was transcluded either in a header element or footer element (if attribute `useFooter` was defined).

```html
<multi-step-container steps="steps">
    This my header content
</multi-step-container>
```

Would result in:

```html
<section class="multi-step-container">
    <header class="multi-step-header" multi-step-control-element>
        This my header content
    </header>

    <main class="multi-step-body" form-step-container>
        <div class="form-step">
            <!-- The current step -->
        </div>
    </main>
</section>
```
