# The `multiStepContainer` directive

## Attributes

```html
<multi-step-container steps="steps"
                      on-finish="finish()"
                      on-cancel="cancel()"
                      search-id="'wizard-id'"
                      initial-step="1">
</multi-step-container>
```

`steps` _angular expression_  
The list of steps.

`initialStep` _angular expression_  
The starting step.

`searchId` _angular expression_  
The name of the search parameter to use (enables browser navigation).

`onFinish`  _angular expression_  
The expression to execute if the multi-step form is finished.

`onCancel`  _angular expression_  
The expression to execute if the multi-step form is cancelled.

`useFooter`  _attribute_  
By default, the content of a multi step container directive will be transcluded inside a
header element. If the `useFooter` attribute is present (regardless of its value), the directive's
content will be transcluded in a footer element (see markup below).

## Markup structure

### With header

```html
<section class="multi-step-container">
    <header class="multi-step-header" multi-step-control-element>
        <!-- Transcluded content -->
    </header>

    <main class="multi-step-body" form-step-container>
        <div class="form-step">
            <!-- The current step -->
        </div>
    </main>
</section>
```

### With footer

```html
<section class="multi-step-container">
    <main class="multi-step-body" form-step-container>
        <div class="form-step">
            <!-- The current step -->
        </div>
    </main>

    <footer class="multi-step-footer" multi-step-control-element>
        <!-- Transcluded content -->
    </footer>
</section>
```
