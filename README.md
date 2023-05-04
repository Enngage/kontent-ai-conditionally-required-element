<p align="center">
<image src="docs/kontent.webp" alt="kontent logo" width="150" />
</p>

## Description

This custom element for [Kentico Kontent](https://kontent.ai) is used for rebuilding Open API references

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
    "productionGhBranch": "main",
    "previewGhBranch": "main-preview",
    "azureFunctionUrl": "https://kontent-ai-api-reference-prod.azurewebsites.net/api/buildApiReferenceJson/{{apiReferenceCodename}}?code=xxx"
}
```

## What is Saved

This custom element does not save any value

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

