# @omnific/request

## 0.1.0

### Minor Changes

- Breaking change: `FetchResponseType` is no longer exported. Use the shared `ResponseType` export instead.

  Fetch `responseType` values now use the shared lowercase names: `arraybuffer` and `formdata` replace the previous `arrayBuffer` and `formData` names.

  Fetch network failures and timeout aborts now reject with `FetchError` consistently. XHR config types now exclude the unsupported `formdata` response type.
