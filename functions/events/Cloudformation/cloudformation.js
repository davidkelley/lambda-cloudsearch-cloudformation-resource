import Response from './response';

export function wrap(Req, ...params) {
  return (ev, ctx, fn) => { new Req(ev, ctx, fn).perform(...params); };
}

class Cloudformation {
  constructor(event, context, cb) {
    this.event = event;
    this.context = context;
    this.response = new Response(event, cb);
  }

  perform() {
    this[this.type]();
  }

  get properties() {
    return this.event.ResourceProperties;
  }

  get id() {
    return this.event.PhysicalResourceId;
  }

  get type() {
    switch (this.event.RequestType) {
      default:
        return this.event.RequestType.toLowerCase();
    }
  }
}

export default Cloudformation;
