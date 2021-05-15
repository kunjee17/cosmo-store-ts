type StreamId = string;

type Any = never;
type NoStream = never;
type Exact = number;

type ExpectedVersion = Any | NoStream | Exact

type AllEvents = never;
type FromVersion = number;
type ToVersion = number;
type VersionRange = {
  readonly fromVersion: FromVersion;
  readonly toVersion: ToVersion;
}

type EventReadRange = AllEvents | FromVersion | ToVersion | VersionRange

type AllStreams = never;
type StartsWith = string;
type EndsWith = string;
type Contains = string;

type StreamReadFilter = AllStreams | StartsWith | EndsWith | Contains


type EventRead<Payload, Meta> = {
  readonly id: string,
  readonly correlationId?: string,
  readonly causationId? : string,
  readonly streamId: string,
  readonly version: number,
  readonly name: string,
  readonly data: Payload,
  readonly metaData: Meta,
  readonly createdUtc : Date
}

type EventWrite<Payload, Meta> = {
  readonly id: string,
  readonly correlationId?: string,
  readonly causationId? : string,
  readonly name: string,
  readonly data: Payload,
  readonly metaData: Meta
}

type Stream = {
  readonly id: StreamId,
  readonly lastVersion : number,
  readonly lastUpdatedUtc : Date
}

type EventStore<Payload, Meta> = {
  readonly appendEvent : (streamId: StreamId, expectedVersion: ExpectedVersion, eventWrite: EventWrite<Payload, Meta>) => Promise<EventRead<Payload, Meta>>,
  readonly appendEvents : (streamId: StreamId, expectedVersion: ExpectedVersion, eventWrites : ReadonlyArray<EventWrite<Payload, Meta>>) => Promise<ReadonlyArray<EventRead<Payload, Meta>>>
  readonly getEvent: (streamId: StreamId, version: number) => Promise<EventRead<Payload, Meta>>,
  readonly getEvents : (streamId :StreamId, eventReadRange: EventReadRange) => Promise<ReadonlyArray<EventRead<Payload, Meta>>>,
  readonly getEventsByCorrelationId: (id: string) => Promise<ReadonlyArray<EventRead<Payload, Meta>>>,
  readonly getStreams: (streamReadFilter: StreamReadFilter) => Promise<ReadonlyArray<Stream>>,
  readonly getStream: (id: StreamId) => Promise<Stream>,
}
