<p align="center">
<image src="docs/kontent.webp" alt="kontent logo" width="150" />
</p>

## Description

This custom element for [Kentico Kontent](https://kontent.ai) is used to make an element conditionally required based on values from other elements

## Deploy

Run 

```bash
netlify:deploy:prod
```

or

```bash
netlify:deploy:dev
```

## Configuration

You will need to add the custom element to a content type filling in the hosted code URL and the following JSON parameters:

```json
{
    "requiredElementCodename": "author", // codename of element that should be required - only linked items field supported in this demo
    "sourceElementCodename": "confirmation", // codename of element on which it depends if element is required - only multiple choice element supported in this demo
    "sourceElementValue": "required", // value of the lement on which it depends if element is required - only multiple choice element supported in this demo
    "previewApiKey": "x" // Preview API Key to read linked items field
}
```

## What is Saved

This custom element saves either `null` or `1`

## Development

This custom element is built with `Angular`. See package.json for scripts regarding building & publishing the library.

## Contributors

We have collected notes on how to contribute to this project in [CONTRIBUTING.md](CONTRIBUTING.md).

Originally created by [@Enngage](https://github.com/Enngage)

<a href="https://github.com/Enngage/kontent-kontent-ai-conditionally-required-element/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Enngage/kontent-kontent-ai-conditionally-required-element" />
</a>

## License

[MIT](https://tldrlegal.com/license/mit-license)

