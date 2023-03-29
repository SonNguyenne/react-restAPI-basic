import {
  Application,
  Binding,
  Component,
  CoreBindings,
  inject,
} from '@loopback/core';
import { MetabaseServiceBindings } from './keys';
import {MetabaseService} from './services/metabase.service';

export class TestComponent implements Component {
  bindings = [Binding.bind(MetabaseServiceBindings.METABASE).toClass(MetabaseService)];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) app: Application) {}
}
