import {v4 as UUID} from 'uuid';

import {
  EventReadRange,
  EventStore, EventWrite,
  ExpectedVersion,
  StreamId
} from './cosmo_store';

export type Aggregate<State, Command, Event> = {
  readonly init: State,
  readonly apply: (state: State, event: Event) => State,
  readonly execute: (state: State, command: Command) => ReadonlyArray<Event>
}

const fromEventToEventWrite = <Payload, Meta>(name: string, payload: Payload, metaData? : Meta, causationId?: string, correlationId?: string) => {
  return {
    id: UUID(),
    data: payload,
    name,
    causationId,
    correlationId,
    metaData
  } as EventWrite<Payload, Meta>
}

export const makeHandler = async <State, Command, Event, Meta>(
  name: string,
  aggregate: Aggregate<State, Command, Event>,
  store: EventStore<Event, Meta>,
  command: Command,
  streamId: StreamId,
  range: EventReadRange,
  expectedVersion: ExpectedVersion
) => {
  const events = await store.getEvents(streamId, range);
  const state = events.reduce( (x , y) => aggregate.apply(x , y.data), aggregate.init );
  const newEvents = await aggregate.execute(state, command);
  // TODO: Make this more flexible to take more details in like meta and other ids
  return await store.appendEvents(streamId, expectedVersion, newEvents.map(x => fromEventToEventWrite(name, x)));
}
