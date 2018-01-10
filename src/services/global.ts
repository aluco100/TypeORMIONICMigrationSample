export var Global = {
  url: "https://demo6197478.mockable.io",
};
export function RestangularConfigFactory(RestangularProvider) {
  RestangularProvider.setBaseUrl(Global.url + '/api/1/');
}
