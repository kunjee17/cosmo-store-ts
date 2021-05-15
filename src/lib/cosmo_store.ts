export type StreamId = string;

export type Any = never;
export type NoStream = never;
export type Exact = number;

export type ExpectedVersion = Any | NoStream | Exact

export type AllEvents = never;
export type FromVersion = number;
export type ToVersion = number;
export type VersionRange = {
  readonly fromVersion: FromVersion;
  readonly toVersion: ToVersion;
}

export type EventReadRange = AllEvents | FromVersion | ToVersion | VersionRange

export type AllStreams = never;
export type StartsWith = string;
export type EndsWith = string;
export type Contains = string;

export type StreamReadFilter = AllStreams | StartsWith | EndsWith | Contains


export type EventRead<Payload, Meta> = {
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

export type EventWrite<Payload, Meta> = {
  readonly id: string,
  readonly correlationId?: string,
  readonly causationId? : string,
  readonly name: string,
  readonly data: Payload,
  readonly metaData: Meta
}

export type Stream = {
  readonly id: StreamId,
  readonly lastVersion : number,
  readonly lastUpdatedUtc : Date
}

export type EventStore<Payload, Meta> = {
  readonly appendEvent : (streamId: StreamId, expectedVersion: ExpectedVersion, eventWrite: EventWrite<Payload, Meta>) => Promise<EventRead<Payload, Meta>>,
  readonly appendEvents : (streamId: StreamId, expectedVersion: ExpectedVersion, eventWrites : ReadonlyArray<EventWrite<Payload, Meta>>) => Promise<ReadonlyArray<EventRead<Payload, Meta>>>
  readonly getEvent: (streamId: StreamId, version: number) => Promise<EventRead<Payload, Meta>>,
  readonly getEvents : (streamId :StreamId, eventReadRange: EventReadRange) => Promise<ReadonlyArray<EventRead<Payload, Meta>>>,
  readonly getEventsByCorrelationId: (id: string) => Promise<ReadonlyArray<EventRead<Payload, Meta>>>,
  readonly getStreams: (streamReadFilter: StreamReadFilter) => Promise<ReadonlyArray<Stream>>,
  readonly getStream: (id: StreamId) => Promise<Stream>,
}
