import { environment } from '../../../environments/environment';

const baseURL = environment.baseURL;
const version = environment.version;

export const apiURLS = {
  _payment: {
    methods: `${baseURL}/${version}/payment/methods`,
    history: `${baseURL}/${version}/payment/history`,
    deleteMethod(paymentMethodID: string): string {
      return `${baseURL}/${version}/music/myPlaylist/deletePlaylist/${paymentMethodID}`;
    },
  },
  plans: {
    _test: `${baseURL}/${version}/test/test`,
  },
};
