# How To Contribute

## Pull Request Guidelines

## Issues Guidelines

## Coding Style

Default prittier :)

## Coding Conventions

## <a name="commit"></a> Commit Message Convention

We have very precise rules over how our Git commit messages must be formatted.
This format leads to **easier to read commit history**.

> **TL;DR:**
> Run `yarn commit` to create a proper commit message

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the [Commit Message Header](#commit-header) format.

The `body` is mandatory for all commits except for those of type "docs".
When the body is present it must be at least 20 characters long and must conform to the [Commit Message Body](#commit-body) format.

The `footer` is optional. The [Commit Message Footer](#commit-footer) format describes what the footer is used for and the structure it must have.

Any line of the commit message cannot be longer than 100 characters.

## <a name="commit-header"></a>Commit Message Header

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: project names
  │
  └─⫸ Commit Type: fix|feat|perf|docs|refactor|test|chore|...
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

### Commit Message Details

See `commitlint.config.js` for details.
