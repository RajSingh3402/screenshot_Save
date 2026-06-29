
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Website
 * 
 */
export type Website = $Result.DefaultSelection<Prisma.$WebsitePayload>
/**
 * Model Report
 * 
 */
export type Report = $Result.DefaultSelection<Prisma.$ReportPayload>
/**
 * Model ReportDetail
 * 
 */
export type ReportDetail = $Result.DefaultSelection<Prisma.$ReportDetailPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Schedule
 * 
 */
export type Schedule = $Result.DefaultSelection<Prisma.$SchedulePayload>
/**
 * Model EmailRecipient
 * 
 */
export type EmailRecipient = $Result.DefaultSelection<Prisma.$EmailRecipientPayload>
/**
 * Model SmtpSetting
 * 
 */
export type SmtpSetting = $Result.DefaultSelection<Prisma.$SmtpSettingPayload>
/**
 * Model SmtpConfig
 * 
 */
export type SmtpConfig = $Result.DefaultSelection<Prisma.$SmtpConfigPayload>
/**
 * Model ScanExecutionLog
 * 
 */
export type ScanExecutionLog = $Result.DefaultSelection<Prisma.$ScanExecutionLogPayload>
/**
 * Model Metric
 * 
 */
export type Metric = $Result.DefaultSelection<Prisma.$MetricPayload>
/**
 * Model Server
 * 
 */
export type Server = $Result.DefaultSelection<Prisma.$ServerPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Websites
 * const websites = await prisma.website.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Websites
   * const websites = await prisma.website.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.website`: Exposes CRUD operations for the **Website** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Websites
    * const websites = await prisma.website.findMany()
    * ```
    */
  get website(): Prisma.WebsiteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.report`: Exposes CRUD operations for the **Report** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reports
    * const reports = await prisma.report.findMany()
    * ```
    */
  get report(): Prisma.ReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reportDetail`: Exposes CRUD operations for the **ReportDetail** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReportDetails
    * const reportDetails = await prisma.reportDetail.findMany()
    * ```
    */
  get reportDetail(): Prisma.ReportDetailDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.schedule`: Exposes CRUD operations for the **Schedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Schedules
    * const schedules = await prisma.schedule.findMany()
    * ```
    */
  get schedule(): Prisma.ScheduleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.emailRecipient`: Exposes CRUD operations for the **EmailRecipient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmailRecipients
    * const emailRecipients = await prisma.emailRecipient.findMany()
    * ```
    */
  get emailRecipient(): Prisma.EmailRecipientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.smtpSetting`: Exposes CRUD operations for the **SmtpSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SmtpSettings
    * const smtpSettings = await prisma.smtpSetting.findMany()
    * ```
    */
  get smtpSetting(): Prisma.SmtpSettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.smtpConfig`: Exposes CRUD operations for the **SmtpConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SmtpConfigs
    * const smtpConfigs = await prisma.smtpConfig.findMany()
    * ```
    */
  get smtpConfig(): Prisma.SmtpConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scanExecutionLog`: Exposes CRUD operations for the **ScanExecutionLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScanExecutionLogs
    * const scanExecutionLogs = await prisma.scanExecutionLog.findMany()
    * ```
    */
  get scanExecutionLog(): Prisma.ScanExecutionLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.metric`: Exposes CRUD operations for the **Metric** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Metrics
    * const metrics = await prisma.metric.findMany()
    * ```
    */
  get metric(): Prisma.MetricDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.server`: Exposes CRUD operations for the **Server** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Servers
    * const servers = await prisma.server.findMany()
    * ```
    */
  get server(): Prisma.ServerDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Website: 'Website',
    Report: 'Report',
    ReportDetail: 'ReportDetail',
    User: 'User',
    Schedule: 'Schedule',
    EmailRecipient: 'EmailRecipient',
    SmtpSetting: 'SmtpSetting',
    SmtpConfig: 'SmtpConfig',
    ScanExecutionLog: 'ScanExecutionLog',
    Metric: 'Metric',
    Server: 'Server'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "website" | "report" | "reportDetail" | "user" | "schedule" | "emailRecipient" | "smtpSetting" | "smtpConfig" | "scanExecutionLog" | "metric" | "server"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Website: {
        payload: Prisma.$WebsitePayload<ExtArgs>
        fields: Prisma.WebsiteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WebsiteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebsitePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WebsiteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebsitePayload>
          }
          findFirst: {
            args: Prisma.WebsiteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebsitePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WebsiteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebsitePayload>
          }
          findMany: {
            args: Prisma.WebsiteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebsitePayload>[]
          }
          create: {
            args: Prisma.WebsiteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebsitePayload>
          }
          createMany: {
            args: Prisma.WebsiteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.WebsiteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebsitePayload>
          }
          update: {
            args: Prisma.WebsiteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebsitePayload>
          }
          deleteMany: {
            args: Prisma.WebsiteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WebsiteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WebsiteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebsitePayload>
          }
          aggregate: {
            args: Prisma.WebsiteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWebsite>
          }
          groupBy: {
            args: Prisma.WebsiteGroupByArgs<ExtArgs>
            result: $Utils.Optional<WebsiteGroupByOutputType>[]
          }
          count: {
            args: Prisma.WebsiteCountArgs<ExtArgs>
            result: $Utils.Optional<WebsiteCountAggregateOutputType> | number
          }
        }
      }
      Report: {
        payload: Prisma.$ReportPayload<ExtArgs>
        fields: Prisma.ReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findFirst: {
            args: Prisma.ReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findMany: {
            args: Prisma.ReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          create: {
            args: Prisma.ReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          createMany: {
            args: Prisma.ReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          update: {
            args: Prisma.ReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          deleteMany: {
            args: Prisma.ReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          aggregate: {
            args: Prisma.ReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReport>
          }
          groupBy: {
            args: Prisma.ReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReportCountArgs<ExtArgs>
            result: $Utils.Optional<ReportCountAggregateOutputType> | number
          }
        }
      }
      ReportDetail: {
        payload: Prisma.$ReportDetailPayload<ExtArgs>
        fields: Prisma.ReportDetailFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReportDetailFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportDetailPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReportDetailFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportDetailPayload>
          }
          findFirst: {
            args: Prisma.ReportDetailFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportDetailPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReportDetailFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportDetailPayload>
          }
          findMany: {
            args: Prisma.ReportDetailFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportDetailPayload>[]
          }
          create: {
            args: Prisma.ReportDetailCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportDetailPayload>
          }
          createMany: {
            args: Prisma.ReportDetailCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ReportDetailDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportDetailPayload>
          }
          update: {
            args: Prisma.ReportDetailUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportDetailPayload>
          }
          deleteMany: {
            args: Prisma.ReportDetailDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReportDetailUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReportDetailUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportDetailPayload>
          }
          aggregate: {
            args: Prisma.ReportDetailAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReportDetail>
          }
          groupBy: {
            args: Prisma.ReportDetailGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReportDetailGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReportDetailCountArgs<ExtArgs>
            result: $Utils.Optional<ReportDetailCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Schedule: {
        payload: Prisma.$SchedulePayload<ExtArgs>
        fields: Prisma.ScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          findFirst: {
            args: Prisma.ScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          findMany: {
            args: Prisma.ScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>[]
          }
          create: {
            args: Prisma.ScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          createMany: {
            args: Prisma.ScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          update: {
            args: Prisma.ScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          deleteMany: {
            args: Prisma.ScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          aggregate: {
            args: Prisma.ScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSchedule>
          }
          groupBy: {
            args: Prisma.ScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<ScheduleCountAggregateOutputType> | number
          }
        }
      }
      EmailRecipient: {
        payload: Prisma.$EmailRecipientPayload<ExtArgs>
        fields: Prisma.EmailRecipientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmailRecipientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailRecipientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmailRecipientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailRecipientPayload>
          }
          findFirst: {
            args: Prisma.EmailRecipientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailRecipientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmailRecipientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailRecipientPayload>
          }
          findMany: {
            args: Prisma.EmailRecipientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailRecipientPayload>[]
          }
          create: {
            args: Prisma.EmailRecipientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailRecipientPayload>
          }
          createMany: {
            args: Prisma.EmailRecipientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.EmailRecipientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailRecipientPayload>
          }
          update: {
            args: Prisma.EmailRecipientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailRecipientPayload>
          }
          deleteMany: {
            args: Prisma.EmailRecipientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmailRecipientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EmailRecipientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailRecipientPayload>
          }
          aggregate: {
            args: Prisma.EmailRecipientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmailRecipient>
          }
          groupBy: {
            args: Prisma.EmailRecipientGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmailRecipientGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmailRecipientCountArgs<ExtArgs>
            result: $Utils.Optional<EmailRecipientCountAggregateOutputType> | number
          }
        }
      }
      SmtpSetting: {
        payload: Prisma.$SmtpSettingPayload<ExtArgs>
        fields: Prisma.SmtpSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SmtpSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SmtpSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpSettingPayload>
          }
          findFirst: {
            args: Prisma.SmtpSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SmtpSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpSettingPayload>
          }
          findMany: {
            args: Prisma.SmtpSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpSettingPayload>[]
          }
          create: {
            args: Prisma.SmtpSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpSettingPayload>
          }
          createMany: {
            args: Prisma.SmtpSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SmtpSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpSettingPayload>
          }
          update: {
            args: Prisma.SmtpSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpSettingPayload>
          }
          deleteMany: {
            args: Prisma.SmtpSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SmtpSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SmtpSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpSettingPayload>
          }
          aggregate: {
            args: Prisma.SmtpSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSmtpSetting>
          }
          groupBy: {
            args: Prisma.SmtpSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<SmtpSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.SmtpSettingCountArgs<ExtArgs>
            result: $Utils.Optional<SmtpSettingCountAggregateOutputType> | number
          }
        }
      }
      SmtpConfig: {
        payload: Prisma.$SmtpConfigPayload<ExtArgs>
        fields: Prisma.SmtpConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SmtpConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SmtpConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpConfigPayload>
          }
          findFirst: {
            args: Prisma.SmtpConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SmtpConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpConfigPayload>
          }
          findMany: {
            args: Prisma.SmtpConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpConfigPayload>[]
          }
          create: {
            args: Prisma.SmtpConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpConfigPayload>
          }
          createMany: {
            args: Prisma.SmtpConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SmtpConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpConfigPayload>
          }
          update: {
            args: Prisma.SmtpConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpConfigPayload>
          }
          deleteMany: {
            args: Prisma.SmtpConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SmtpConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SmtpConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SmtpConfigPayload>
          }
          aggregate: {
            args: Prisma.SmtpConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSmtpConfig>
          }
          groupBy: {
            args: Prisma.SmtpConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<SmtpConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.SmtpConfigCountArgs<ExtArgs>
            result: $Utils.Optional<SmtpConfigCountAggregateOutputType> | number
          }
        }
      }
      ScanExecutionLog: {
        payload: Prisma.$ScanExecutionLogPayload<ExtArgs>
        fields: Prisma.ScanExecutionLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScanExecutionLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanExecutionLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScanExecutionLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanExecutionLogPayload>
          }
          findFirst: {
            args: Prisma.ScanExecutionLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanExecutionLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScanExecutionLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanExecutionLogPayload>
          }
          findMany: {
            args: Prisma.ScanExecutionLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanExecutionLogPayload>[]
          }
          create: {
            args: Prisma.ScanExecutionLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanExecutionLogPayload>
          }
          createMany: {
            args: Prisma.ScanExecutionLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ScanExecutionLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanExecutionLogPayload>
          }
          update: {
            args: Prisma.ScanExecutionLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanExecutionLogPayload>
          }
          deleteMany: {
            args: Prisma.ScanExecutionLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScanExecutionLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ScanExecutionLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScanExecutionLogPayload>
          }
          aggregate: {
            args: Prisma.ScanExecutionLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScanExecutionLog>
          }
          groupBy: {
            args: Prisma.ScanExecutionLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScanExecutionLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScanExecutionLogCountArgs<ExtArgs>
            result: $Utils.Optional<ScanExecutionLogCountAggregateOutputType> | number
          }
        }
      }
      Metric: {
        payload: Prisma.$MetricPayload<ExtArgs>
        fields: Prisma.MetricFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MetricFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MetricFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>
          }
          findFirst: {
            args: Prisma.MetricFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MetricFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>
          }
          findMany: {
            args: Prisma.MetricFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>[]
          }
          create: {
            args: Prisma.MetricCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>
          }
          createMany: {
            args: Prisma.MetricCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MetricDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>
          }
          update: {
            args: Prisma.MetricUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>
          }
          deleteMany: {
            args: Prisma.MetricDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MetricUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MetricUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetricPayload>
          }
          aggregate: {
            args: Prisma.MetricAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMetric>
          }
          groupBy: {
            args: Prisma.MetricGroupByArgs<ExtArgs>
            result: $Utils.Optional<MetricGroupByOutputType>[]
          }
          count: {
            args: Prisma.MetricCountArgs<ExtArgs>
            result: $Utils.Optional<MetricCountAggregateOutputType> | number
          }
        }
      }
      Server: {
        payload: Prisma.$ServerPayload<ExtArgs>
        fields: Prisma.ServerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerPayload>
          }
          findFirst: {
            args: Prisma.ServerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerPayload>
          }
          findMany: {
            args: Prisma.ServerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerPayload>[]
          }
          create: {
            args: Prisma.ServerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerPayload>
          }
          createMany: {
            args: Prisma.ServerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ServerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerPayload>
          }
          update: {
            args: Prisma.ServerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerPayload>
          }
          deleteMany: {
            args: Prisma.ServerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ServerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerPayload>
          }
          aggregate: {
            args: Prisma.ServerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServer>
          }
          groupBy: {
            args: Prisma.ServerGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServerGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServerCountArgs<ExtArgs>
            result: $Utils.Optional<ServerCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    website?: WebsiteOmit
    report?: ReportOmit
    reportDetail?: ReportDetailOmit
    user?: UserOmit
    schedule?: ScheduleOmit
    emailRecipient?: EmailRecipientOmit
    smtpSetting?: SmtpSettingOmit
    smtpConfig?: SmtpConfigOmit
    scanExecutionLog?: ScanExecutionLogOmit
    metric?: MetricOmit
    server?: ServerOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ReportCountOutputType
   */

  export type ReportCountOutputType = {
    details: number
  }

  export type ReportCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    details?: boolean | ReportCountOutputTypeCountDetailsArgs
  }

  // Custom InputTypes
  /**
   * ReportCountOutputType without action
   */
  export type ReportCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportCountOutputType
     */
    select?: ReportCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ReportCountOutputType without action
   */
  export type ReportCountOutputTypeCountDetailsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportDetailWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Website
   */

  export type AggregateWebsite = {
    _count: WebsiteCountAggregateOutputType | null
    _avg: WebsiteAvgAggregateOutputType | null
    _sum: WebsiteSumAggregateOutputType | null
    _min: WebsiteMinAggregateOutputType | null
    _max: WebsiteMaxAggregateOutputType | null
  }

  export type WebsiteAvgAggregateOutputType = {
    id: number | null
  }

  export type WebsiteSumAggregateOutputType = {
    id: bigint | null
  }

  export type WebsiteMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    url: string | null
    status: string | null
    lastStatus: string | null
    lastCapture: string | null
    error: string | null
    lastCaptureImage: string | null
    alertEmail: string | null
    emailStatus: string | null
    lastAlertSentAt: Date | null
    domainEmailStatus: string | null
    lastDomainAlertSentAt: Date | null
  }

  export type WebsiteMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    url: string | null
    status: string | null
    lastStatus: string | null
    lastCapture: string | null
    error: string | null
    lastCaptureImage: string | null
    alertEmail: string | null
    emailStatus: string | null
    lastAlertSentAt: Date | null
    domainEmailStatus: string | null
    lastDomainAlertSentAt: Date | null
  }

  export type WebsiteCountAggregateOutputType = {
    id: number
    name: number
    url: number
    status: number
    lastStatus: number
    lastCapture: number
    error: number
    lastCaptureImage: number
    alertEmail: number
    emailStatus: number
    lastAlertSentAt: number
    domainEmailStatus: number
    lastDomainAlertSentAt: number
    _all: number
  }


  export type WebsiteAvgAggregateInputType = {
    id?: true
  }

  export type WebsiteSumAggregateInputType = {
    id?: true
  }

  export type WebsiteMinAggregateInputType = {
    id?: true
    name?: true
    url?: true
    status?: true
    lastStatus?: true
    lastCapture?: true
    error?: true
    lastCaptureImage?: true
    alertEmail?: true
    emailStatus?: true
    lastAlertSentAt?: true
    domainEmailStatus?: true
    lastDomainAlertSentAt?: true
  }

  export type WebsiteMaxAggregateInputType = {
    id?: true
    name?: true
    url?: true
    status?: true
    lastStatus?: true
    lastCapture?: true
    error?: true
    lastCaptureImage?: true
    alertEmail?: true
    emailStatus?: true
    lastAlertSentAt?: true
    domainEmailStatus?: true
    lastDomainAlertSentAt?: true
  }

  export type WebsiteCountAggregateInputType = {
    id?: true
    name?: true
    url?: true
    status?: true
    lastStatus?: true
    lastCapture?: true
    error?: true
    lastCaptureImage?: true
    alertEmail?: true
    emailStatus?: true
    lastAlertSentAt?: true
    domainEmailStatus?: true
    lastDomainAlertSentAt?: true
    _all?: true
  }

  export type WebsiteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Website to aggregate.
     */
    where?: WebsiteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Websites to fetch.
     */
    orderBy?: WebsiteOrderByWithRelationInput | WebsiteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WebsiteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Websites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Websites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Websites
    **/
    _count?: true | WebsiteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WebsiteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WebsiteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WebsiteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WebsiteMaxAggregateInputType
  }

  export type GetWebsiteAggregateType<T extends WebsiteAggregateArgs> = {
        [P in keyof T & keyof AggregateWebsite]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWebsite[P]>
      : GetScalarType<T[P], AggregateWebsite[P]>
  }




  export type WebsiteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebsiteWhereInput
    orderBy?: WebsiteOrderByWithAggregationInput | WebsiteOrderByWithAggregationInput[]
    by: WebsiteScalarFieldEnum[] | WebsiteScalarFieldEnum
    having?: WebsiteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WebsiteCountAggregateInputType | true
    _avg?: WebsiteAvgAggregateInputType
    _sum?: WebsiteSumAggregateInputType
    _min?: WebsiteMinAggregateInputType
    _max?: WebsiteMaxAggregateInputType
  }

  export type WebsiteGroupByOutputType = {
    id: bigint
    name: string
    url: string
    status: string
    lastStatus: string | null
    lastCapture: string | null
    error: string | null
    lastCaptureImage: string | null
    alertEmail: string | null
    emailStatus: string | null
    lastAlertSentAt: Date | null
    domainEmailStatus: string | null
    lastDomainAlertSentAt: Date | null
    _count: WebsiteCountAggregateOutputType | null
    _avg: WebsiteAvgAggregateOutputType | null
    _sum: WebsiteSumAggregateOutputType | null
    _min: WebsiteMinAggregateOutputType | null
    _max: WebsiteMaxAggregateOutputType | null
  }

  type GetWebsiteGroupByPayload<T extends WebsiteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WebsiteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WebsiteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WebsiteGroupByOutputType[P]>
            : GetScalarType<T[P], WebsiteGroupByOutputType[P]>
        }
      >
    >


  export type WebsiteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    status?: boolean
    lastStatus?: boolean
    lastCapture?: boolean
    error?: boolean
    lastCaptureImage?: boolean
    alertEmail?: boolean
    emailStatus?: boolean
    lastAlertSentAt?: boolean
    domainEmailStatus?: boolean
    lastDomainAlertSentAt?: boolean
  }, ExtArgs["result"]["website"]>



  export type WebsiteSelectScalar = {
    id?: boolean
    name?: boolean
    url?: boolean
    status?: boolean
    lastStatus?: boolean
    lastCapture?: boolean
    error?: boolean
    lastCaptureImage?: boolean
    alertEmail?: boolean
    emailStatus?: boolean
    lastAlertSentAt?: boolean
    domainEmailStatus?: boolean
    lastDomainAlertSentAt?: boolean
  }

  export type WebsiteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "url" | "status" | "lastStatus" | "lastCapture" | "error" | "lastCaptureImage" | "alertEmail" | "emailStatus" | "lastAlertSentAt" | "domainEmailStatus" | "lastDomainAlertSentAt", ExtArgs["result"]["website"]>

  export type $WebsitePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Website"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      url: string
      status: string
      lastStatus: string | null
      lastCapture: string | null
      error: string | null
      lastCaptureImage: string | null
      alertEmail: string | null
      emailStatus: string | null
      lastAlertSentAt: Date | null
      domainEmailStatus: string | null
      lastDomainAlertSentAt: Date | null
    }, ExtArgs["result"]["website"]>
    composites: {}
  }

  type WebsiteGetPayload<S extends boolean | null | undefined | WebsiteDefaultArgs> = $Result.GetResult<Prisma.$WebsitePayload, S>

  type WebsiteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WebsiteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WebsiteCountAggregateInputType | true
    }

  export interface WebsiteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Website'], meta: { name: 'Website' } }
    /**
     * Find zero or one Website that matches the filter.
     * @param {WebsiteFindUniqueArgs} args - Arguments to find a Website
     * @example
     * // Get one Website
     * const website = await prisma.website.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WebsiteFindUniqueArgs>(args: SelectSubset<T, WebsiteFindUniqueArgs<ExtArgs>>): Prisma__WebsiteClient<$Result.GetResult<Prisma.$WebsitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Website that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WebsiteFindUniqueOrThrowArgs} args - Arguments to find a Website
     * @example
     * // Get one Website
     * const website = await prisma.website.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WebsiteFindUniqueOrThrowArgs>(args: SelectSubset<T, WebsiteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WebsiteClient<$Result.GetResult<Prisma.$WebsitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Website that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebsiteFindFirstArgs} args - Arguments to find a Website
     * @example
     * // Get one Website
     * const website = await prisma.website.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WebsiteFindFirstArgs>(args?: SelectSubset<T, WebsiteFindFirstArgs<ExtArgs>>): Prisma__WebsiteClient<$Result.GetResult<Prisma.$WebsitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Website that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebsiteFindFirstOrThrowArgs} args - Arguments to find a Website
     * @example
     * // Get one Website
     * const website = await prisma.website.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WebsiteFindFirstOrThrowArgs>(args?: SelectSubset<T, WebsiteFindFirstOrThrowArgs<ExtArgs>>): Prisma__WebsiteClient<$Result.GetResult<Prisma.$WebsitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Websites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebsiteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Websites
     * const websites = await prisma.website.findMany()
     * 
     * // Get first 10 Websites
     * const websites = await prisma.website.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const websiteWithIdOnly = await prisma.website.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WebsiteFindManyArgs>(args?: SelectSubset<T, WebsiteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebsitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Website.
     * @param {WebsiteCreateArgs} args - Arguments to create a Website.
     * @example
     * // Create one Website
     * const Website = await prisma.website.create({
     *   data: {
     *     // ... data to create a Website
     *   }
     * })
     * 
     */
    create<T extends WebsiteCreateArgs>(args: SelectSubset<T, WebsiteCreateArgs<ExtArgs>>): Prisma__WebsiteClient<$Result.GetResult<Prisma.$WebsitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Websites.
     * @param {WebsiteCreateManyArgs} args - Arguments to create many Websites.
     * @example
     * // Create many Websites
     * const website = await prisma.website.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WebsiteCreateManyArgs>(args?: SelectSubset<T, WebsiteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Website.
     * @param {WebsiteDeleteArgs} args - Arguments to delete one Website.
     * @example
     * // Delete one Website
     * const Website = await prisma.website.delete({
     *   where: {
     *     // ... filter to delete one Website
     *   }
     * })
     * 
     */
    delete<T extends WebsiteDeleteArgs>(args: SelectSubset<T, WebsiteDeleteArgs<ExtArgs>>): Prisma__WebsiteClient<$Result.GetResult<Prisma.$WebsitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Website.
     * @param {WebsiteUpdateArgs} args - Arguments to update one Website.
     * @example
     * // Update one Website
     * const website = await prisma.website.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WebsiteUpdateArgs>(args: SelectSubset<T, WebsiteUpdateArgs<ExtArgs>>): Prisma__WebsiteClient<$Result.GetResult<Prisma.$WebsitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Websites.
     * @param {WebsiteDeleteManyArgs} args - Arguments to filter Websites to delete.
     * @example
     * // Delete a few Websites
     * const { count } = await prisma.website.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WebsiteDeleteManyArgs>(args?: SelectSubset<T, WebsiteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Websites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebsiteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Websites
     * const website = await prisma.website.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WebsiteUpdateManyArgs>(args: SelectSubset<T, WebsiteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Website.
     * @param {WebsiteUpsertArgs} args - Arguments to update or create a Website.
     * @example
     * // Update or create a Website
     * const website = await prisma.website.upsert({
     *   create: {
     *     // ... data to create a Website
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Website we want to update
     *   }
     * })
     */
    upsert<T extends WebsiteUpsertArgs>(args: SelectSubset<T, WebsiteUpsertArgs<ExtArgs>>): Prisma__WebsiteClient<$Result.GetResult<Prisma.$WebsitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Websites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebsiteCountArgs} args - Arguments to filter Websites to count.
     * @example
     * // Count the number of Websites
     * const count = await prisma.website.count({
     *   where: {
     *     // ... the filter for the Websites we want to count
     *   }
     * })
    **/
    count<T extends WebsiteCountArgs>(
      args?: Subset<T, WebsiteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WebsiteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Website.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebsiteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WebsiteAggregateArgs>(args: Subset<T, WebsiteAggregateArgs>): Prisma.PrismaPromise<GetWebsiteAggregateType<T>>

    /**
     * Group by Website.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebsiteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WebsiteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WebsiteGroupByArgs['orderBy'] }
        : { orderBy?: WebsiteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WebsiteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWebsiteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Website model
   */
  readonly fields: WebsiteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Website.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WebsiteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Website model
   */
  interface WebsiteFieldRefs {
    readonly id: FieldRef<"Website", 'BigInt'>
    readonly name: FieldRef<"Website", 'String'>
    readonly url: FieldRef<"Website", 'String'>
    readonly status: FieldRef<"Website", 'String'>
    readonly lastStatus: FieldRef<"Website", 'String'>
    readonly lastCapture: FieldRef<"Website", 'String'>
    readonly error: FieldRef<"Website", 'String'>
    readonly lastCaptureImage: FieldRef<"Website", 'String'>
    readonly alertEmail: FieldRef<"Website", 'String'>
    readonly emailStatus: FieldRef<"Website", 'String'>
    readonly lastAlertSentAt: FieldRef<"Website", 'DateTime'>
    readonly domainEmailStatus: FieldRef<"Website", 'String'>
    readonly lastDomainAlertSentAt: FieldRef<"Website", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Website findUnique
   */
  export type WebsiteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Website
     */
    select?: WebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Website
     */
    omit?: WebsiteOmit<ExtArgs> | null
    /**
     * Filter, which Website to fetch.
     */
    where: WebsiteWhereUniqueInput
  }

  /**
   * Website findUniqueOrThrow
   */
  export type WebsiteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Website
     */
    select?: WebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Website
     */
    omit?: WebsiteOmit<ExtArgs> | null
    /**
     * Filter, which Website to fetch.
     */
    where: WebsiteWhereUniqueInput
  }

  /**
   * Website findFirst
   */
  export type WebsiteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Website
     */
    select?: WebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Website
     */
    omit?: WebsiteOmit<ExtArgs> | null
    /**
     * Filter, which Website to fetch.
     */
    where?: WebsiteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Websites to fetch.
     */
    orderBy?: WebsiteOrderByWithRelationInput | WebsiteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Websites.
     */
    cursor?: WebsiteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Websites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Websites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Websites.
     */
    distinct?: WebsiteScalarFieldEnum | WebsiteScalarFieldEnum[]
  }

  /**
   * Website findFirstOrThrow
   */
  export type WebsiteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Website
     */
    select?: WebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Website
     */
    omit?: WebsiteOmit<ExtArgs> | null
    /**
     * Filter, which Website to fetch.
     */
    where?: WebsiteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Websites to fetch.
     */
    orderBy?: WebsiteOrderByWithRelationInput | WebsiteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Websites.
     */
    cursor?: WebsiteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Websites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Websites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Websites.
     */
    distinct?: WebsiteScalarFieldEnum | WebsiteScalarFieldEnum[]
  }

  /**
   * Website findMany
   */
  export type WebsiteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Website
     */
    select?: WebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Website
     */
    omit?: WebsiteOmit<ExtArgs> | null
    /**
     * Filter, which Websites to fetch.
     */
    where?: WebsiteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Websites to fetch.
     */
    orderBy?: WebsiteOrderByWithRelationInput | WebsiteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Websites.
     */
    cursor?: WebsiteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Websites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Websites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Websites.
     */
    distinct?: WebsiteScalarFieldEnum | WebsiteScalarFieldEnum[]
  }

  /**
   * Website create
   */
  export type WebsiteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Website
     */
    select?: WebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Website
     */
    omit?: WebsiteOmit<ExtArgs> | null
    /**
     * The data needed to create a Website.
     */
    data: XOR<WebsiteCreateInput, WebsiteUncheckedCreateInput>
  }

  /**
   * Website createMany
   */
  export type WebsiteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Websites.
     */
    data: WebsiteCreateManyInput | WebsiteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Website update
   */
  export type WebsiteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Website
     */
    select?: WebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Website
     */
    omit?: WebsiteOmit<ExtArgs> | null
    /**
     * The data needed to update a Website.
     */
    data: XOR<WebsiteUpdateInput, WebsiteUncheckedUpdateInput>
    /**
     * Choose, which Website to update.
     */
    where: WebsiteWhereUniqueInput
  }

  /**
   * Website updateMany
   */
  export type WebsiteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Websites.
     */
    data: XOR<WebsiteUpdateManyMutationInput, WebsiteUncheckedUpdateManyInput>
    /**
     * Filter which Websites to update
     */
    where?: WebsiteWhereInput
    /**
     * Limit how many Websites to update.
     */
    limit?: number
  }

  /**
   * Website upsert
   */
  export type WebsiteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Website
     */
    select?: WebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Website
     */
    omit?: WebsiteOmit<ExtArgs> | null
    /**
     * The filter to search for the Website to update in case it exists.
     */
    where: WebsiteWhereUniqueInput
    /**
     * In case the Website found by the `where` argument doesn't exist, create a new Website with this data.
     */
    create: XOR<WebsiteCreateInput, WebsiteUncheckedCreateInput>
    /**
     * In case the Website was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WebsiteUpdateInput, WebsiteUncheckedUpdateInput>
  }

  /**
   * Website delete
   */
  export type WebsiteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Website
     */
    select?: WebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Website
     */
    omit?: WebsiteOmit<ExtArgs> | null
    /**
     * Filter which Website to delete.
     */
    where: WebsiteWhereUniqueInput
  }

  /**
   * Website deleteMany
   */
  export type WebsiteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Websites to delete
     */
    where?: WebsiteWhereInput
    /**
     * Limit how many Websites to delete.
     */
    limit?: number
  }

  /**
   * Website without action
   */
  export type WebsiteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Website
     */
    select?: WebsiteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Website
     */
    omit?: WebsiteOmit<ExtArgs> | null
  }


  /**
   * Model Report
   */

  export type AggregateReport = {
    _count: ReportCountAggregateOutputType | null
    _avg: ReportAvgAggregateOutputType | null
    _sum: ReportSumAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  export type ReportAvgAggregateOutputType = {
    id: number | null
    total: number | null
    success: number | null
    failed: number | null
  }

  export type ReportSumAggregateOutputType = {
    id: bigint | null
    total: number | null
    success: number | null
    failed: number | null
  }

  export type ReportMinAggregateOutputType = {
    id: bigint | null
    date: string | null
    time: string | null
    total: number | null
    success: number | null
    failed: number | null
    file: string | null
  }

  export type ReportMaxAggregateOutputType = {
    id: bigint | null
    date: string | null
    time: string | null
    total: number | null
    success: number | null
    failed: number | null
    file: string | null
  }

  export type ReportCountAggregateOutputType = {
    id: number
    date: number
    time: number
    total: number
    success: number
    failed: number
    file: number
    _all: number
  }


  export type ReportAvgAggregateInputType = {
    id?: true
    total?: true
    success?: true
    failed?: true
  }

  export type ReportSumAggregateInputType = {
    id?: true
    total?: true
    success?: true
    failed?: true
  }

  export type ReportMinAggregateInputType = {
    id?: true
    date?: true
    time?: true
    total?: true
    success?: true
    failed?: true
    file?: true
  }

  export type ReportMaxAggregateInputType = {
    id?: true
    date?: true
    time?: true
    total?: true
    success?: true
    failed?: true
    file?: true
  }

  export type ReportCountAggregateInputType = {
    id?: true
    date?: true
    time?: true
    total?: true
    success?: true
    failed?: true
    file?: true
    _all?: true
  }

  export type ReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Report to aggregate.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reports
    **/
    _count?: true | ReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReportAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReportSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReportMaxAggregateInputType
  }

  export type GetReportAggregateType<T extends ReportAggregateArgs> = {
        [P in keyof T & keyof AggregateReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReport[P]>
      : GetScalarType<T[P], AggregateReport[P]>
  }




  export type ReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithAggregationInput | ReportOrderByWithAggregationInput[]
    by: ReportScalarFieldEnum[] | ReportScalarFieldEnum
    having?: ReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReportCountAggregateInputType | true
    _avg?: ReportAvgAggregateInputType
    _sum?: ReportSumAggregateInputType
    _min?: ReportMinAggregateInputType
    _max?: ReportMaxAggregateInputType
  }

  export type ReportGroupByOutputType = {
    id: bigint
    date: string
    time: string
    total: number
    success: number
    failed: number
    file: string
    _count: ReportCountAggregateOutputType | null
    _avg: ReportAvgAggregateOutputType | null
    _sum: ReportSumAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  type GetReportGroupByPayload<T extends ReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReportGroupByOutputType[P]>
            : GetScalarType<T[P], ReportGroupByOutputType[P]>
        }
      >
    >


  export type ReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    time?: boolean
    total?: boolean
    success?: boolean
    failed?: boolean
    file?: boolean
    details?: boolean | Report$detailsArgs<ExtArgs>
    _count?: boolean | ReportCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["report"]>



  export type ReportSelectScalar = {
    id?: boolean
    date?: boolean
    time?: boolean
    total?: boolean
    success?: boolean
    failed?: boolean
    file?: boolean
  }

  export type ReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "time" | "total" | "success" | "failed" | "file", ExtArgs["result"]["report"]>
  export type ReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    details?: boolean | Report$detailsArgs<ExtArgs>
    _count?: boolean | ReportCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Report"
    objects: {
      details: Prisma.$ReportDetailPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      date: string
      time: string
      total: number
      success: number
      failed: number
      file: string
    }, ExtArgs["result"]["report"]>
    composites: {}
  }

  type ReportGetPayload<S extends boolean | null | undefined | ReportDefaultArgs> = $Result.GetResult<Prisma.$ReportPayload, S>

  type ReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReportCountAggregateInputType | true
    }

  export interface ReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Report'], meta: { name: 'Report' } }
    /**
     * Find zero or one Report that matches the filter.
     * @param {ReportFindUniqueArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReportFindUniqueArgs>(args: SelectSubset<T, ReportFindUniqueArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Report that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReportFindUniqueOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReportFindUniqueOrThrowArgs>(args: SelectSubset<T, ReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Report that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReportFindFirstArgs>(args?: SelectSubset<T, ReportFindFirstArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Report that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReportFindFirstOrThrowArgs>(args?: SelectSubset<T, ReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reports
     * const reports = await prisma.report.findMany()
     * 
     * // Get first 10 Reports
     * const reports = await prisma.report.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reportWithIdOnly = await prisma.report.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReportFindManyArgs>(args?: SelectSubset<T, ReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Report.
     * @param {ReportCreateArgs} args - Arguments to create a Report.
     * @example
     * // Create one Report
     * const Report = await prisma.report.create({
     *   data: {
     *     // ... data to create a Report
     *   }
     * })
     * 
     */
    create<T extends ReportCreateArgs>(args: SelectSubset<T, ReportCreateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reports.
     * @param {ReportCreateManyArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const report = await prisma.report.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReportCreateManyArgs>(args?: SelectSubset<T, ReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Report.
     * @param {ReportDeleteArgs} args - Arguments to delete one Report.
     * @example
     * // Delete one Report
     * const Report = await prisma.report.delete({
     *   where: {
     *     // ... filter to delete one Report
     *   }
     * })
     * 
     */
    delete<T extends ReportDeleteArgs>(args: SelectSubset<T, ReportDeleteArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Report.
     * @param {ReportUpdateArgs} args - Arguments to update one Report.
     * @example
     * // Update one Report
     * const report = await prisma.report.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReportUpdateArgs>(args: SelectSubset<T, ReportUpdateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reports.
     * @param {ReportDeleteManyArgs} args - Arguments to filter Reports to delete.
     * @example
     * // Delete a few Reports
     * const { count } = await prisma.report.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReportDeleteManyArgs>(args?: SelectSubset<T, ReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reports
     * const report = await prisma.report.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReportUpdateManyArgs>(args: SelectSubset<T, ReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Report.
     * @param {ReportUpsertArgs} args - Arguments to update or create a Report.
     * @example
     * // Update or create a Report
     * const report = await prisma.report.upsert({
     *   create: {
     *     // ... data to create a Report
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Report we want to update
     *   }
     * })
     */
    upsert<T extends ReportUpsertArgs>(args: SelectSubset<T, ReportUpsertArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportCountArgs} args - Arguments to filter Reports to count.
     * @example
     * // Count the number of Reports
     * const count = await prisma.report.count({
     *   where: {
     *     // ... the filter for the Reports we want to count
     *   }
     * })
    **/
    count<T extends ReportCountArgs>(
      args?: Subset<T, ReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReportAggregateArgs>(args: Subset<T, ReportAggregateArgs>): Prisma.PrismaPromise<GetReportAggregateType<T>>

    /**
     * Group by Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReportGroupByArgs['orderBy'] }
        : { orderBy?: ReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Report model
   */
  readonly fields: ReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Report.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    details<T extends Report$detailsArgs<ExtArgs> = {}>(args?: Subset<T, Report$detailsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportDetailPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Report model
   */
  interface ReportFieldRefs {
    readonly id: FieldRef<"Report", 'BigInt'>
    readonly date: FieldRef<"Report", 'String'>
    readonly time: FieldRef<"Report", 'String'>
    readonly total: FieldRef<"Report", 'Int'>
    readonly success: FieldRef<"Report", 'Int'>
    readonly failed: FieldRef<"Report", 'Int'>
    readonly file: FieldRef<"Report", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Report findUnique
   */
  export type ReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findUniqueOrThrow
   */
  export type ReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findFirst
   */
  export type ReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findFirstOrThrow
   */
  export type ReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findMany
   */
  export type ReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Reports to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report create
   */
  export type ReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The data needed to create a Report.
     */
    data: XOR<ReportCreateInput, ReportUncheckedCreateInput>
  }

  /**
   * Report createMany
   */
  export type ReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reports.
     */
    data: ReportCreateManyInput | ReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Report update
   */
  export type ReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The data needed to update a Report.
     */
    data: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
    /**
     * Choose, which Report to update.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report updateMany
   */
  export type ReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reports.
     */
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyInput>
    /**
     * Filter which Reports to update
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to update.
     */
    limit?: number
  }

  /**
   * Report upsert
   */
  export type ReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The filter to search for the Report to update in case it exists.
     */
    where: ReportWhereUniqueInput
    /**
     * In case the Report found by the `where` argument doesn't exist, create a new Report with this data.
     */
    create: XOR<ReportCreateInput, ReportUncheckedCreateInput>
    /**
     * In case the Report was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
  }

  /**
   * Report delete
   */
  export type ReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter which Report to delete.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report deleteMany
   */
  export type ReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reports to delete
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to delete.
     */
    limit?: number
  }

  /**
   * Report.details
   */
  export type Report$detailsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportDetail
     */
    select?: ReportDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportDetail
     */
    omit?: ReportDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportDetailInclude<ExtArgs> | null
    where?: ReportDetailWhereInput
    orderBy?: ReportDetailOrderByWithRelationInput | ReportDetailOrderByWithRelationInput[]
    cursor?: ReportDetailWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReportDetailScalarFieldEnum | ReportDetailScalarFieldEnum[]
  }

  /**
   * Report without action
   */
  export type ReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
  }


  /**
   * Model ReportDetail
   */

  export type AggregateReportDetail = {
    _count: ReportDetailCountAggregateOutputType | null
    _avg: ReportDetailAvgAggregateOutputType | null
    _sum: ReportDetailSumAggregateOutputType | null
    _min: ReportDetailMinAggregateOutputType | null
    _max: ReportDetailMaxAggregateOutputType | null
  }

  export type ReportDetailAvgAggregateOutputType = {
    id: number | null
    reportId: number | null
    websiteId: number | null
    loadTime: number | null
  }

  export type ReportDetailSumAggregateOutputType = {
    id: number | null
    reportId: bigint | null
    websiteId: bigint | null
    loadTime: number | null
  }

  export type ReportDetailMinAggregateOutputType = {
    id: number | null
    reportId: bigint | null
    websiteId: bigint | null
    name: string | null
    url: string | null
    status: string | null
    loadTime: number | null
    error: string | null
    screenshot: string | null
  }

  export type ReportDetailMaxAggregateOutputType = {
    id: number | null
    reportId: bigint | null
    websiteId: bigint | null
    name: string | null
    url: string | null
    status: string | null
    loadTime: number | null
    error: string | null
    screenshot: string | null
  }

  export type ReportDetailCountAggregateOutputType = {
    id: number
    reportId: number
    websiteId: number
    name: number
    url: number
    status: number
    loadTime: number
    error: number
    screenshot: number
    _all: number
  }


  export type ReportDetailAvgAggregateInputType = {
    id?: true
    reportId?: true
    websiteId?: true
    loadTime?: true
  }

  export type ReportDetailSumAggregateInputType = {
    id?: true
    reportId?: true
    websiteId?: true
    loadTime?: true
  }

  export type ReportDetailMinAggregateInputType = {
    id?: true
    reportId?: true
    websiteId?: true
    name?: true
    url?: true
    status?: true
    loadTime?: true
    error?: true
    screenshot?: true
  }

  export type ReportDetailMaxAggregateInputType = {
    id?: true
    reportId?: true
    websiteId?: true
    name?: true
    url?: true
    status?: true
    loadTime?: true
    error?: true
    screenshot?: true
  }

  export type ReportDetailCountAggregateInputType = {
    id?: true
    reportId?: true
    websiteId?: true
    name?: true
    url?: true
    status?: true
    loadTime?: true
    error?: true
    screenshot?: true
    _all?: true
  }

  export type ReportDetailAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReportDetail to aggregate.
     */
    where?: ReportDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReportDetails to fetch.
     */
    orderBy?: ReportDetailOrderByWithRelationInput | ReportDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReportDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReportDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReportDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReportDetails
    **/
    _count?: true | ReportDetailCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReportDetailAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReportDetailSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReportDetailMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReportDetailMaxAggregateInputType
  }

  export type GetReportDetailAggregateType<T extends ReportDetailAggregateArgs> = {
        [P in keyof T & keyof AggregateReportDetail]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReportDetail[P]>
      : GetScalarType<T[P], AggregateReportDetail[P]>
  }




  export type ReportDetailGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportDetailWhereInput
    orderBy?: ReportDetailOrderByWithAggregationInput | ReportDetailOrderByWithAggregationInput[]
    by: ReportDetailScalarFieldEnum[] | ReportDetailScalarFieldEnum
    having?: ReportDetailScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReportDetailCountAggregateInputType | true
    _avg?: ReportDetailAvgAggregateInputType
    _sum?: ReportDetailSumAggregateInputType
    _min?: ReportDetailMinAggregateInputType
    _max?: ReportDetailMaxAggregateInputType
  }

  export type ReportDetailGroupByOutputType = {
    id: number
    reportId: bigint
    websiteId: bigint
    name: string
    url: string
    status: string
    loadTime: number | null
    error: string | null
    screenshot: string | null
    _count: ReportDetailCountAggregateOutputType | null
    _avg: ReportDetailAvgAggregateOutputType | null
    _sum: ReportDetailSumAggregateOutputType | null
    _min: ReportDetailMinAggregateOutputType | null
    _max: ReportDetailMaxAggregateOutputType | null
  }

  type GetReportDetailGroupByPayload<T extends ReportDetailGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReportDetailGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReportDetailGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReportDetailGroupByOutputType[P]>
            : GetScalarType<T[P], ReportDetailGroupByOutputType[P]>
        }
      >
    >


  export type ReportDetailSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reportId?: boolean
    websiteId?: boolean
    name?: boolean
    url?: boolean
    status?: boolean
    loadTime?: boolean
    error?: boolean
    screenshot?: boolean
    report?: boolean | ReportDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reportDetail"]>



  export type ReportDetailSelectScalar = {
    id?: boolean
    reportId?: boolean
    websiteId?: boolean
    name?: boolean
    url?: boolean
    status?: boolean
    loadTime?: boolean
    error?: boolean
    screenshot?: boolean
  }

  export type ReportDetailOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "reportId" | "websiteId" | "name" | "url" | "status" | "loadTime" | "error" | "screenshot", ExtArgs["result"]["reportDetail"]>
  export type ReportDetailInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    report?: boolean | ReportDefaultArgs<ExtArgs>
  }

  export type $ReportDetailPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReportDetail"
    objects: {
      report: Prisma.$ReportPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      reportId: bigint
      websiteId: bigint
      name: string
      url: string
      status: string
      loadTime: number | null
      error: string | null
      screenshot: string | null
    }, ExtArgs["result"]["reportDetail"]>
    composites: {}
  }

  type ReportDetailGetPayload<S extends boolean | null | undefined | ReportDetailDefaultArgs> = $Result.GetResult<Prisma.$ReportDetailPayload, S>

  type ReportDetailCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReportDetailFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReportDetailCountAggregateInputType | true
    }

  export interface ReportDetailDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReportDetail'], meta: { name: 'ReportDetail' } }
    /**
     * Find zero or one ReportDetail that matches the filter.
     * @param {ReportDetailFindUniqueArgs} args - Arguments to find a ReportDetail
     * @example
     * // Get one ReportDetail
     * const reportDetail = await prisma.reportDetail.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReportDetailFindUniqueArgs>(args: SelectSubset<T, ReportDetailFindUniqueArgs<ExtArgs>>): Prisma__ReportDetailClient<$Result.GetResult<Prisma.$ReportDetailPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ReportDetail that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReportDetailFindUniqueOrThrowArgs} args - Arguments to find a ReportDetail
     * @example
     * // Get one ReportDetail
     * const reportDetail = await prisma.reportDetail.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReportDetailFindUniqueOrThrowArgs>(args: SelectSubset<T, ReportDetailFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReportDetailClient<$Result.GetResult<Prisma.$ReportDetailPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReportDetail that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportDetailFindFirstArgs} args - Arguments to find a ReportDetail
     * @example
     * // Get one ReportDetail
     * const reportDetail = await prisma.reportDetail.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReportDetailFindFirstArgs>(args?: SelectSubset<T, ReportDetailFindFirstArgs<ExtArgs>>): Prisma__ReportDetailClient<$Result.GetResult<Prisma.$ReportDetailPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReportDetail that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportDetailFindFirstOrThrowArgs} args - Arguments to find a ReportDetail
     * @example
     * // Get one ReportDetail
     * const reportDetail = await prisma.reportDetail.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReportDetailFindFirstOrThrowArgs>(args?: SelectSubset<T, ReportDetailFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReportDetailClient<$Result.GetResult<Prisma.$ReportDetailPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ReportDetails that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportDetailFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReportDetails
     * const reportDetails = await prisma.reportDetail.findMany()
     * 
     * // Get first 10 ReportDetails
     * const reportDetails = await prisma.reportDetail.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reportDetailWithIdOnly = await prisma.reportDetail.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReportDetailFindManyArgs>(args?: SelectSubset<T, ReportDetailFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportDetailPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ReportDetail.
     * @param {ReportDetailCreateArgs} args - Arguments to create a ReportDetail.
     * @example
     * // Create one ReportDetail
     * const ReportDetail = await prisma.reportDetail.create({
     *   data: {
     *     // ... data to create a ReportDetail
     *   }
     * })
     * 
     */
    create<T extends ReportDetailCreateArgs>(args: SelectSubset<T, ReportDetailCreateArgs<ExtArgs>>): Prisma__ReportDetailClient<$Result.GetResult<Prisma.$ReportDetailPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ReportDetails.
     * @param {ReportDetailCreateManyArgs} args - Arguments to create many ReportDetails.
     * @example
     * // Create many ReportDetails
     * const reportDetail = await prisma.reportDetail.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReportDetailCreateManyArgs>(args?: SelectSubset<T, ReportDetailCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ReportDetail.
     * @param {ReportDetailDeleteArgs} args - Arguments to delete one ReportDetail.
     * @example
     * // Delete one ReportDetail
     * const ReportDetail = await prisma.reportDetail.delete({
     *   where: {
     *     // ... filter to delete one ReportDetail
     *   }
     * })
     * 
     */
    delete<T extends ReportDetailDeleteArgs>(args: SelectSubset<T, ReportDetailDeleteArgs<ExtArgs>>): Prisma__ReportDetailClient<$Result.GetResult<Prisma.$ReportDetailPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ReportDetail.
     * @param {ReportDetailUpdateArgs} args - Arguments to update one ReportDetail.
     * @example
     * // Update one ReportDetail
     * const reportDetail = await prisma.reportDetail.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReportDetailUpdateArgs>(args: SelectSubset<T, ReportDetailUpdateArgs<ExtArgs>>): Prisma__ReportDetailClient<$Result.GetResult<Prisma.$ReportDetailPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ReportDetails.
     * @param {ReportDetailDeleteManyArgs} args - Arguments to filter ReportDetails to delete.
     * @example
     * // Delete a few ReportDetails
     * const { count } = await prisma.reportDetail.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReportDetailDeleteManyArgs>(args?: SelectSubset<T, ReportDetailDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReportDetails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportDetailUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReportDetails
     * const reportDetail = await prisma.reportDetail.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReportDetailUpdateManyArgs>(args: SelectSubset<T, ReportDetailUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReportDetail.
     * @param {ReportDetailUpsertArgs} args - Arguments to update or create a ReportDetail.
     * @example
     * // Update or create a ReportDetail
     * const reportDetail = await prisma.reportDetail.upsert({
     *   create: {
     *     // ... data to create a ReportDetail
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReportDetail we want to update
     *   }
     * })
     */
    upsert<T extends ReportDetailUpsertArgs>(args: SelectSubset<T, ReportDetailUpsertArgs<ExtArgs>>): Prisma__ReportDetailClient<$Result.GetResult<Prisma.$ReportDetailPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ReportDetails.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportDetailCountArgs} args - Arguments to filter ReportDetails to count.
     * @example
     * // Count the number of ReportDetails
     * const count = await prisma.reportDetail.count({
     *   where: {
     *     // ... the filter for the ReportDetails we want to count
     *   }
     * })
    **/
    count<T extends ReportDetailCountArgs>(
      args?: Subset<T, ReportDetailCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReportDetailCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReportDetail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportDetailAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReportDetailAggregateArgs>(args: Subset<T, ReportDetailAggregateArgs>): Prisma.PrismaPromise<GetReportDetailAggregateType<T>>

    /**
     * Group by ReportDetail.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportDetailGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReportDetailGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReportDetailGroupByArgs['orderBy'] }
        : { orderBy?: ReportDetailGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReportDetailGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportDetailGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReportDetail model
   */
  readonly fields: ReportDetailFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReportDetail.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReportDetailClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    report<T extends ReportDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReportDefaultArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReportDetail model
   */
  interface ReportDetailFieldRefs {
    readonly id: FieldRef<"ReportDetail", 'Int'>
    readonly reportId: FieldRef<"ReportDetail", 'BigInt'>
    readonly websiteId: FieldRef<"ReportDetail", 'BigInt'>
    readonly name: FieldRef<"ReportDetail", 'String'>
    readonly url: FieldRef<"ReportDetail", 'String'>
    readonly status: FieldRef<"ReportDetail", 'String'>
    readonly loadTime: FieldRef<"ReportDetail", 'Int'>
    readonly error: FieldRef<"ReportDetail", 'String'>
    readonly screenshot: FieldRef<"ReportDetail", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ReportDetail findUnique
   */
  export type ReportDetailFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportDetail
     */
    select?: ReportDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportDetail
     */
    omit?: ReportDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportDetailInclude<ExtArgs> | null
    /**
     * Filter, which ReportDetail to fetch.
     */
    where: ReportDetailWhereUniqueInput
  }

  /**
   * ReportDetail findUniqueOrThrow
   */
  export type ReportDetailFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportDetail
     */
    select?: ReportDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportDetail
     */
    omit?: ReportDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportDetailInclude<ExtArgs> | null
    /**
     * Filter, which ReportDetail to fetch.
     */
    where: ReportDetailWhereUniqueInput
  }

  /**
   * ReportDetail findFirst
   */
  export type ReportDetailFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportDetail
     */
    select?: ReportDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportDetail
     */
    omit?: ReportDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportDetailInclude<ExtArgs> | null
    /**
     * Filter, which ReportDetail to fetch.
     */
    where?: ReportDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReportDetails to fetch.
     */
    orderBy?: ReportDetailOrderByWithRelationInput | ReportDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReportDetails.
     */
    cursor?: ReportDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReportDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReportDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReportDetails.
     */
    distinct?: ReportDetailScalarFieldEnum | ReportDetailScalarFieldEnum[]
  }

  /**
   * ReportDetail findFirstOrThrow
   */
  export type ReportDetailFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportDetail
     */
    select?: ReportDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportDetail
     */
    omit?: ReportDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportDetailInclude<ExtArgs> | null
    /**
     * Filter, which ReportDetail to fetch.
     */
    where?: ReportDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReportDetails to fetch.
     */
    orderBy?: ReportDetailOrderByWithRelationInput | ReportDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReportDetails.
     */
    cursor?: ReportDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReportDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReportDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReportDetails.
     */
    distinct?: ReportDetailScalarFieldEnum | ReportDetailScalarFieldEnum[]
  }

  /**
   * ReportDetail findMany
   */
  export type ReportDetailFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportDetail
     */
    select?: ReportDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportDetail
     */
    omit?: ReportDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportDetailInclude<ExtArgs> | null
    /**
     * Filter, which ReportDetails to fetch.
     */
    where?: ReportDetailWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReportDetails to fetch.
     */
    orderBy?: ReportDetailOrderByWithRelationInput | ReportDetailOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReportDetails.
     */
    cursor?: ReportDetailWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReportDetails from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReportDetails.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReportDetails.
     */
    distinct?: ReportDetailScalarFieldEnum | ReportDetailScalarFieldEnum[]
  }

  /**
   * ReportDetail create
   */
  export type ReportDetailCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportDetail
     */
    select?: ReportDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportDetail
     */
    omit?: ReportDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportDetailInclude<ExtArgs> | null
    /**
     * The data needed to create a ReportDetail.
     */
    data: XOR<ReportDetailCreateInput, ReportDetailUncheckedCreateInput>
  }

  /**
   * ReportDetail createMany
   */
  export type ReportDetailCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReportDetails.
     */
    data: ReportDetailCreateManyInput | ReportDetailCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReportDetail update
   */
  export type ReportDetailUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportDetail
     */
    select?: ReportDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportDetail
     */
    omit?: ReportDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportDetailInclude<ExtArgs> | null
    /**
     * The data needed to update a ReportDetail.
     */
    data: XOR<ReportDetailUpdateInput, ReportDetailUncheckedUpdateInput>
    /**
     * Choose, which ReportDetail to update.
     */
    where: ReportDetailWhereUniqueInput
  }

  /**
   * ReportDetail updateMany
   */
  export type ReportDetailUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReportDetails.
     */
    data: XOR<ReportDetailUpdateManyMutationInput, ReportDetailUncheckedUpdateManyInput>
    /**
     * Filter which ReportDetails to update
     */
    where?: ReportDetailWhereInput
    /**
     * Limit how many ReportDetails to update.
     */
    limit?: number
  }

  /**
   * ReportDetail upsert
   */
  export type ReportDetailUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportDetail
     */
    select?: ReportDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportDetail
     */
    omit?: ReportDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportDetailInclude<ExtArgs> | null
    /**
     * The filter to search for the ReportDetail to update in case it exists.
     */
    where: ReportDetailWhereUniqueInput
    /**
     * In case the ReportDetail found by the `where` argument doesn't exist, create a new ReportDetail with this data.
     */
    create: XOR<ReportDetailCreateInput, ReportDetailUncheckedCreateInput>
    /**
     * In case the ReportDetail was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReportDetailUpdateInput, ReportDetailUncheckedUpdateInput>
  }

  /**
   * ReportDetail delete
   */
  export type ReportDetailDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportDetail
     */
    select?: ReportDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportDetail
     */
    omit?: ReportDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportDetailInclude<ExtArgs> | null
    /**
     * Filter which ReportDetail to delete.
     */
    where: ReportDetailWhereUniqueInput
  }

  /**
   * ReportDetail deleteMany
   */
  export type ReportDetailDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReportDetails to delete
     */
    where?: ReportDetailWhereInput
    /**
     * Limit how many ReportDetails to delete.
     */
    limit?: number
  }

  /**
   * ReportDetail without action
   */
  export type ReportDetailDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportDetail
     */
    select?: ReportDetailSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReportDetail
     */
    omit?: ReportDetailOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportDetailInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: bigint | null
  }

  export type UserMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: bigint
    name: string
    email: string
    password: string
    role: string
    status: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      email: string
      password: string
      role: string
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'BigInt'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly status: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model Schedule
   */

  export type AggregateSchedule = {
    _count: ScheduleCountAggregateOutputType | null
    _avg: ScheduleAvgAggregateOutputType | null
    _sum: ScheduleSumAggregateOutputType | null
    _min: ScheduleMinAggregateOutputType | null
    _max: ScheduleMaxAggregateOutputType | null
  }

  export type ScheduleAvgAggregateOutputType = {
    id: number | null
  }

  export type ScheduleSumAggregateOutputType = {
    id: bigint | null
  }

  export type ScheduleMinAggregateOutputType = {
    id: bigint | null
    time: string | null
    enabled: boolean | null
  }

  export type ScheduleMaxAggregateOutputType = {
    id: bigint | null
    time: string | null
    enabled: boolean | null
  }

  export type ScheduleCountAggregateOutputType = {
    id: number
    time: number
    enabled: number
    _all: number
  }


  export type ScheduleAvgAggregateInputType = {
    id?: true
  }

  export type ScheduleSumAggregateInputType = {
    id?: true
  }

  export type ScheduleMinAggregateInputType = {
    id?: true
    time?: true
    enabled?: true
  }

  export type ScheduleMaxAggregateInputType = {
    id?: true
    time?: true
    enabled?: true
  }

  export type ScheduleCountAggregateInputType = {
    id?: true
    time?: true
    enabled?: true
    _all?: true
  }

  export type ScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Schedule to aggregate.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Schedules
    **/
    _count?: true | ScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScheduleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScheduleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScheduleMaxAggregateInputType
  }

  export type GetScheduleAggregateType<T extends ScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateSchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSchedule[P]>
      : GetScalarType<T[P], AggregateSchedule[P]>
  }




  export type ScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScheduleWhereInput
    orderBy?: ScheduleOrderByWithAggregationInput | ScheduleOrderByWithAggregationInput[]
    by: ScheduleScalarFieldEnum[] | ScheduleScalarFieldEnum
    having?: ScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScheduleCountAggregateInputType | true
    _avg?: ScheduleAvgAggregateInputType
    _sum?: ScheduleSumAggregateInputType
    _min?: ScheduleMinAggregateInputType
    _max?: ScheduleMaxAggregateInputType
  }

  export type ScheduleGroupByOutputType = {
    id: bigint
    time: string
    enabled: boolean
    _count: ScheduleCountAggregateOutputType | null
    _avg: ScheduleAvgAggregateOutputType | null
    _sum: ScheduleSumAggregateOutputType | null
    _min: ScheduleMinAggregateOutputType | null
    _max: ScheduleMaxAggregateOutputType | null
  }

  type GetScheduleGroupByPayload<T extends ScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], ScheduleGroupByOutputType[P]>
        }
      >
    >


  export type ScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    time?: boolean
    enabled?: boolean
  }, ExtArgs["result"]["schedule"]>



  export type ScheduleSelectScalar = {
    id?: boolean
    time?: boolean
    enabled?: boolean
  }

  export type ScheduleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "time" | "enabled", ExtArgs["result"]["schedule"]>

  export type $SchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Schedule"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      time: string
      enabled: boolean
    }, ExtArgs["result"]["schedule"]>
    composites: {}
  }

  type ScheduleGetPayload<S extends boolean | null | undefined | ScheduleDefaultArgs> = $Result.GetResult<Prisma.$SchedulePayload, S>

  type ScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScheduleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScheduleCountAggregateInputType | true
    }

  export interface ScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Schedule'], meta: { name: 'Schedule' } }
    /**
     * Find zero or one Schedule that matches the filter.
     * @param {ScheduleFindUniqueArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScheduleFindUniqueArgs>(args: SelectSubset<T, ScheduleFindUniqueArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Schedule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScheduleFindUniqueOrThrowArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, ScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Schedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleFindFirstArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScheduleFindFirstArgs>(args?: SelectSubset<T, ScheduleFindFirstArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Schedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleFindFirstOrThrowArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, ScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Schedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Schedules
     * const schedules = await prisma.schedule.findMany()
     * 
     * // Get first 10 Schedules
     * const schedules = await prisma.schedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scheduleWithIdOnly = await prisma.schedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScheduleFindManyArgs>(args?: SelectSubset<T, ScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Schedule.
     * @param {ScheduleCreateArgs} args - Arguments to create a Schedule.
     * @example
     * // Create one Schedule
     * const Schedule = await prisma.schedule.create({
     *   data: {
     *     // ... data to create a Schedule
     *   }
     * })
     * 
     */
    create<T extends ScheduleCreateArgs>(args: SelectSubset<T, ScheduleCreateArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Schedules.
     * @param {ScheduleCreateManyArgs} args - Arguments to create many Schedules.
     * @example
     * // Create many Schedules
     * const schedule = await prisma.schedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScheduleCreateManyArgs>(args?: SelectSubset<T, ScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Schedule.
     * @param {ScheduleDeleteArgs} args - Arguments to delete one Schedule.
     * @example
     * // Delete one Schedule
     * const Schedule = await prisma.schedule.delete({
     *   where: {
     *     // ... filter to delete one Schedule
     *   }
     * })
     * 
     */
    delete<T extends ScheduleDeleteArgs>(args: SelectSubset<T, ScheduleDeleteArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Schedule.
     * @param {ScheduleUpdateArgs} args - Arguments to update one Schedule.
     * @example
     * // Update one Schedule
     * const schedule = await prisma.schedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScheduleUpdateArgs>(args: SelectSubset<T, ScheduleUpdateArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Schedules.
     * @param {ScheduleDeleteManyArgs} args - Arguments to filter Schedules to delete.
     * @example
     * // Delete a few Schedules
     * const { count } = await prisma.schedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScheduleDeleteManyArgs>(args?: SelectSubset<T, ScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Schedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Schedules
     * const schedule = await prisma.schedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScheduleUpdateManyArgs>(args: SelectSubset<T, ScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Schedule.
     * @param {ScheduleUpsertArgs} args - Arguments to update or create a Schedule.
     * @example
     * // Update or create a Schedule
     * const schedule = await prisma.schedule.upsert({
     *   create: {
     *     // ... data to create a Schedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Schedule we want to update
     *   }
     * })
     */
    upsert<T extends ScheduleUpsertArgs>(args: SelectSubset<T, ScheduleUpsertArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Schedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleCountArgs} args - Arguments to filter Schedules to count.
     * @example
     * // Count the number of Schedules
     * const count = await prisma.schedule.count({
     *   where: {
     *     // ... the filter for the Schedules we want to count
     *   }
     * })
    **/
    count<T extends ScheduleCountArgs>(
      args?: Subset<T, ScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Schedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScheduleAggregateArgs>(args: Subset<T, ScheduleAggregateArgs>): Prisma.PrismaPromise<GetScheduleAggregateType<T>>

    /**
     * Group by Schedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScheduleGroupByArgs['orderBy'] }
        : { orderBy?: ScheduleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Schedule model
   */
  readonly fields: ScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Schedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Schedule model
   */
  interface ScheduleFieldRefs {
    readonly id: FieldRef<"Schedule", 'BigInt'>
    readonly time: FieldRef<"Schedule", 'String'>
    readonly enabled: FieldRef<"Schedule", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Schedule findUnique
   */
  export type ScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule findUniqueOrThrow
   */
  export type ScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule findFirst
   */
  export type ScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Schedules.
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Schedules.
     */
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Schedule findFirstOrThrow
   */
  export type ScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Schedules.
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Schedules.
     */
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Schedule findMany
   */
  export type ScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Filter, which Schedules to fetch.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Schedules.
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Schedules.
     */
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Schedule create
   */
  export type ScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * The data needed to create a Schedule.
     */
    data: XOR<ScheduleCreateInput, ScheduleUncheckedCreateInput>
  }

  /**
   * Schedule createMany
   */
  export type ScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Schedules.
     */
    data: ScheduleCreateManyInput | ScheduleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Schedule update
   */
  export type ScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * The data needed to update a Schedule.
     */
    data: XOR<ScheduleUpdateInput, ScheduleUncheckedUpdateInput>
    /**
     * Choose, which Schedule to update.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule updateMany
   */
  export type ScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Schedules.
     */
    data: XOR<ScheduleUpdateManyMutationInput, ScheduleUncheckedUpdateManyInput>
    /**
     * Filter which Schedules to update
     */
    where?: ScheduleWhereInput
    /**
     * Limit how many Schedules to update.
     */
    limit?: number
  }

  /**
   * Schedule upsert
   */
  export type ScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * The filter to search for the Schedule to update in case it exists.
     */
    where: ScheduleWhereUniqueInput
    /**
     * In case the Schedule found by the `where` argument doesn't exist, create a new Schedule with this data.
     */
    create: XOR<ScheduleCreateInput, ScheduleUncheckedCreateInput>
    /**
     * In case the Schedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScheduleUpdateInput, ScheduleUncheckedUpdateInput>
  }

  /**
   * Schedule delete
   */
  export type ScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Filter which Schedule to delete.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule deleteMany
   */
  export type ScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Schedules to delete
     */
    where?: ScheduleWhereInput
    /**
     * Limit how many Schedules to delete.
     */
    limit?: number
  }

  /**
   * Schedule without action
   */
  export type ScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
  }


  /**
   * Model EmailRecipient
   */

  export type AggregateEmailRecipient = {
    _count: EmailRecipientCountAggregateOutputType | null
    _avg: EmailRecipientAvgAggregateOutputType | null
    _sum: EmailRecipientSumAggregateOutputType | null
    _min: EmailRecipientMinAggregateOutputType | null
    _max: EmailRecipientMaxAggregateOutputType | null
  }

  export type EmailRecipientAvgAggregateOutputType = {
    id: number | null
  }

  export type EmailRecipientSumAggregateOutputType = {
    id: number | null
  }

  export type EmailRecipientMinAggregateOutputType = {
    id: number | null
    email: string | null
    createdAt: Date | null
  }

  export type EmailRecipientMaxAggregateOutputType = {
    id: number | null
    email: string | null
    createdAt: Date | null
  }

  export type EmailRecipientCountAggregateOutputType = {
    id: number
    email: number
    createdAt: number
    _all: number
  }


  export type EmailRecipientAvgAggregateInputType = {
    id?: true
  }

  export type EmailRecipientSumAggregateInputType = {
    id?: true
  }

  export type EmailRecipientMinAggregateInputType = {
    id?: true
    email?: true
    createdAt?: true
  }

  export type EmailRecipientMaxAggregateInputType = {
    id?: true
    email?: true
    createdAt?: true
  }

  export type EmailRecipientCountAggregateInputType = {
    id?: true
    email?: true
    createdAt?: true
    _all?: true
  }

  export type EmailRecipientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailRecipient to aggregate.
     */
    where?: EmailRecipientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailRecipients to fetch.
     */
    orderBy?: EmailRecipientOrderByWithRelationInput | EmailRecipientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmailRecipientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailRecipients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailRecipients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmailRecipients
    **/
    _count?: true | EmailRecipientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EmailRecipientAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EmailRecipientSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmailRecipientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmailRecipientMaxAggregateInputType
  }

  export type GetEmailRecipientAggregateType<T extends EmailRecipientAggregateArgs> = {
        [P in keyof T & keyof AggregateEmailRecipient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmailRecipient[P]>
      : GetScalarType<T[P], AggregateEmailRecipient[P]>
  }




  export type EmailRecipientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailRecipientWhereInput
    orderBy?: EmailRecipientOrderByWithAggregationInput | EmailRecipientOrderByWithAggregationInput[]
    by: EmailRecipientScalarFieldEnum[] | EmailRecipientScalarFieldEnum
    having?: EmailRecipientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmailRecipientCountAggregateInputType | true
    _avg?: EmailRecipientAvgAggregateInputType
    _sum?: EmailRecipientSumAggregateInputType
    _min?: EmailRecipientMinAggregateInputType
    _max?: EmailRecipientMaxAggregateInputType
  }

  export type EmailRecipientGroupByOutputType = {
    id: number
    email: string
    createdAt: Date
    _count: EmailRecipientCountAggregateOutputType | null
    _avg: EmailRecipientAvgAggregateOutputType | null
    _sum: EmailRecipientSumAggregateOutputType | null
    _min: EmailRecipientMinAggregateOutputType | null
    _max: EmailRecipientMaxAggregateOutputType | null
  }

  type GetEmailRecipientGroupByPayload<T extends EmailRecipientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmailRecipientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmailRecipientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmailRecipientGroupByOutputType[P]>
            : GetScalarType<T[P], EmailRecipientGroupByOutputType[P]>
        }
      >
    >


  export type EmailRecipientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["emailRecipient"]>



  export type EmailRecipientSelectScalar = {
    id?: boolean
    email?: boolean
    createdAt?: boolean
  }

  export type EmailRecipientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "createdAt", ExtArgs["result"]["emailRecipient"]>

  export type $EmailRecipientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmailRecipient"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      createdAt: Date
    }, ExtArgs["result"]["emailRecipient"]>
    composites: {}
  }

  type EmailRecipientGetPayload<S extends boolean | null | undefined | EmailRecipientDefaultArgs> = $Result.GetResult<Prisma.$EmailRecipientPayload, S>

  type EmailRecipientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EmailRecipientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EmailRecipientCountAggregateInputType | true
    }

  export interface EmailRecipientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmailRecipient'], meta: { name: 'EmailRecipient' } }
    /**
     * Find zero or one EmailRecipient that matches the filter.
     * @param {EmailRecipientFindUniqueArgs} args - Arguments to find a EmailRecipient
     * @example
     * // Get one EmailRecipient
     * const emailRecipient = await prisma.emailRecipient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmailRecipientFindUniqueArgs>(args: SelectSubset<T, EmailRecipientFindUniqueArgs<ExtArgs>>): Prisma__EmailRecipientClient<$Result.GetResult<Prisma.$EmailRecipientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EmailRecipient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmailRecipientFindUniqueOrThrowArgs} args - Arguments to find a EmailRecipient
     * @example
     * // Get one EmailRecipient
     * const emailRecipient = await prisma.emailRecipient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmailRecipientFindUniqueOrThrowArgs>(args: SelectSubset<T, EmailRecipientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmailRecipientClient<$Result.GetResult<Prisma.$EmailRecipientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmailRecipient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecipientFindFirstArgs} args - Arguments to find a EmailRecipient
     * @example
     * // Get one EmailRecipient
     * const emailRecipient = await prisma.emailRecipient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmailRecipientFindFirstArgs>(args?: SelectSubset<T, EmailRecipientFindFirstArgs<ExtArgs>>): Prisma__EmailRecipientClient<$Result.GetResult<Prisma.$EmailRecipientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmailRecipient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecipientFindFirstOrThrowArgs} args - Arguments to find a EmailRecipient
     * @example
     * // Get one EmailRecipient
     * const emailRecipient = await prisma.emailRecipient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmailRecipientFindFirstOrThrowArgs>(args?: SelectSubset<T, EmailRecipientFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmailRecipientClient<$Result.GetResult<Prisma.$EmailRecipientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EmailRecipients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecipientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmailRecipients
     * const emailRecipients = await prisma.emailRecipient.findMany()
     * 
     * // Get first 10 EmailRecipients
     * const emailRecipients = await prisma.emailRecipient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const emailRecipientWithIdOnly = await prisma.emailRecipient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmailRecipientFindManyArgs>(args?: SelectSubset<T, EmailRecipientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailRecipientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EmailRecipient.
     * @param {EmailRecipientCreateArgs} args - Arguments to create a EmailRecipient.
     * @example
     * // Create one EmailRecipient
     * const EmailRecipient = await prisma.emailRecipient.create({
     *   data: {
     *     // ... data to create a EmailRecipient
     *   }
     * })
     * 
     */
    create<T extends EmailRecipientCreateArgs>(args: SelectSubset<T, EmailRecipientCreateArgs<ExtArgs>>): Prisma__EmailRecipientClient<$Result.GetResult<Prisma.$EmailRecipientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EmailRecipients.
     * @param {EmailRecipientCreateManyArgs} args - Arguments to create many EmailRecipients.
     * @example
     * // Create many EmailRecipients
     * const emailRecipient = await prisma.emailRecipient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmailRecipientCreateManyArgs>(args?: SelectSubset<T, EmailRecipientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a EmailRecipient.
     * @param {EmailRecipientDeleteArgs} args - Arguments to delete one EmailRecipient.
     * @example
     * // Delete one EmailRecipient
     * const EmailRecipient = await prisma.emailRecipient.delete({
     *   where: {
     *     // ... filter to delete one EmailRecipient
     *   }
     * })
     * 
     */
    delete<T extends EmailRecipientDeleteArgs>(args: SelectSubset<T, EmailRecipientDeleteArgs<ExtArgs>>): Prisma__EmailRecipientClient<$Result.GetResult<Prisma.$EmailRecipientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EmailRecipient.
     * @param {EmailRecipientUpdateArgs} args - Arguments to update one EmailRecipient.
     * @example
     * // Update one EmailRecipient
     * const emailRecipient = await prisma.emailRecipient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmailRecipientUpdateArgs>(args: SelectSubset<T, EmailRecipientUpdateArgs<ExtArgs>>): Prisma__EmailRecipientClient<$Result.GetResult<Prisma.$EmailRecipientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EmailRecipients.
     * @param {EmailRecipientDeleteManyArgs} args - Arguments to filter EmailRecipients to delete.
     * @example
     * // Delete a few EmailRecipients
     * const { count } = await prisma.emailRecipient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmailRecipientDeleteManyArgs>(args?: SelectSubset<T, EmailRecipientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailRecipients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecipientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmailRecipients
     * const emailRecipient = await prisma.emailRecipient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmailRecipientUpdateManyArgs>(args: SelectSubset<T, EmailRecipientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EmailRecipient.
     * @param {EmailRecipientUpsertArgs} args - Arguments to update or create a EmailRecipient.
     * @example
     * // Update or create a EmailRecipient
     * const emailRecipient = await prisma.emailRecipient.upsert({
     *   create: {
     *     // ... data to create a EmailRecipient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmailRecipient we want to update
     *   }
     * })
     */
    upsert<T extends EmailRecipientUpsertArgs>(args: SelectSubset<T, EmailRecipientUpsertArgs<ExtArgs>>): Prisma__EmailRecipientClient<$Result.GetResult<Prisma.$EmailRecipientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EmailRecipients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecipientCountArgs} args - Arguments to filter EmailRecipients to count.
     * @example
     * // Count the number of EmailRecipients
     * const count = await prisma.emailRecipient.count({
     *   where: {
     *     // ... the filter for the EmailRecipients we want to count
     *   }
     * })
    **/
    count<T extends EmailRecipientCountArgs>(
      args?: Subset<T, EmailRecipientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmailRecipientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmailRecipient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecipientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmailRecipientAggregateArgs>(args: Subset<T, EmailRecipientAggregateArgs>): Prisma.PrismaPromise<GetEmailRecipientAggregateType<T>>

    /**
     * Group by EmailRecipient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailRecipientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmailRecipientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmailRecipientGroupByArgs['orderBy'] }
        : { orderBy?: EmailRecipientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmailRecipientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailRecipientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmailRecipient model
   */
  readonly fields: EmailRecipientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmailRecipient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmailRecipientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EmailRecipient model
   */
  interface EmailRecipientFieldRefs {
    readonly id: FieldRef<"EmailRecipient", 'Int'>
    readonly email: FieldRef<"EmailRecipient", 'String'>
    readonly createdAt: FieldRef<"EmailRecipient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EmailRecipient findUnique
   */
  export type EmailRecipientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailRecipient
     */
    select?: EmailRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailRecipient
     */
    omit?: EmailRecipientOmit<ExtArgs> | null
    /**
     * Filter, which EmailRecipient to fetch.
     */
    where: EmailRecipientWhereUniqueInput
  }

  /**
   * EmailRecipient findUniqueOrThrow
   */
  export type EmailRecipientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailRecipient
     */
    select?: EmailRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailRecipient
     */
    omit?: EmailRecipientOmit<ExtArgs> | null
    /**
     * Filter, which EmailRecipient to fetch.
     */
    where: EmailRecipientWhereUniqueInput
  }

  /**
   * EmailRecipient findFirst
   */
  export type EmailRecipientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailRecipient
     */
    select?: EmailRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailRecipient
     */
    omit?: EmailRecipientOmit<ExtArgs> | null
    /**
     * Filter, which EmailRecipient to fetch.
     */
    where?: EmailRecipientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailRecipients to fetch.
     */
    orderBy?: EmailRecipientOrderByWithRelationInput | EmailRecipientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailRecipients.
     */
    cursor?: EmailRecipientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailRecipients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailRecipients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailRecipients.
     */
    distinct?: EmailRecipientScalarFieldEnum | EmailRecipientScalarFieldEnum[]
  }

  /**
   * EmailRecipient findFirstOrThrow
   */
  export type EmailRecipientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailRecipient
     */
    select?: EmailRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailRecipient
     */
    omit?: EmailRecipientOmit<ExtArgs> | null
    /**
     * Filter, which EmailRecipient to fetch.
     */
    where?: EmailRecipientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailRecipients to fetch.
     */
    orderBy?: EmailRecipientOrderByWithRelationInput | EmailRecipientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailRecipients.
     */
    cursor?: EmailRecipientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailRecipients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailRecipients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailRecipients.
     */
    distinct?: EmailRecipientScalarFieldEnum | EmailRecipientScalarFieldEnum[]
  }

  /**
   * EmailRecipient findMany
   */
  export type EmailRecipientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailRecipient
     */
    select?: EmailRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailRecipient
     */
    omit?: EmailRecipientOmit<ExtArgs> | null
    /**
     * Filter, which EmailRecipients to fetch.
     */
    where?: EmailRecipientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailRecipients to fetch.
     */
    orderBy?: EmailRecipientOrderByWithRelationInput | EmailRecipientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmailRecipients.
     */
    cursor?: EmailRecipientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailRecipients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailRecipients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailRecipients.
     */
    distinct?: EmailRecipientScalarFieldEnum | EmailRecipientScalarFieldEnum[]
  }

  /**
   * EmailRecipient create
   */
  export type EmailRecipientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailRecipient
     */
    select?: EmailRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailRecipient
     */
    omit?: EmailRecipientOmit<ExtArgs> | null
    /**
     * The data needed to create a EmailRecipient.
     */
    data: XOR<EmailRecipientCreateInput, EmailRecipientUncheckedCreateInput>
  }

  /**
   * EmailRecipient createMany
   */
  export type EmailRecipientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmailRecipients.
     */
    data: EmailRecipientCreateManyInput | EmailRecipientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailRecipient update
   */
  export type EmailRecipientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailRecipient
     */
    select?: EmailRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailRecipient
     */
    omit?: EmailRecipientOmit<ExtArgs> | null
    /**
     * The data needed to update a EmailRecipient.
     */
    data: XOR<EmailRecipientUpdateInput, EmailRecipientUncheckedUpdateInput>
    /**
     * Choose, which EmailRecipient to update.
     */
    where: EmailRecipientWhereUniqueInput
  }

  /**
   * EmailRecipient updateMany
   */
  export type EmailRecipientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmailRecipients.
     */
    data: XOR<EmailRecipientUpdateManyMutationInput, EmailRecipientUncheckedUpdateManyInput>
    /**
     * Filter which EmailRecipients to update
     */
    where?: EmailRecipientWhereInput
    /**
     * Limit how many EmailRecipients to update.
     */
    limit?: number
  }

  /**
   * EmailRecipient upsert
   */
  export type EmailRecipientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailRecipient
     */
    select?: EmailRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailRecipient
     */
    omit?: EmailRecipientOmit<ExtArgs> | null
    /**
     * The filter to search for the EmailRecipient to update in case it exists.
     */
    where: EmailRecipientWhereUniqueInput
    /**
     * In case the EmailRecipient found by the `where` argument doesn't exist, create a new EmailRecipient with this data.
     */
    create: XOR<EmailRecipientCreateInput, EmailRecipientUncheckedCreateInput>
    /**
     * In case the EmailRecipient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmailRecipientUpdateInput, EmailRecipientUncheckedUpdateInput>
  }

  /**
   * EmailRecipient delete
   */
  export type EmailRecipientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailRecipient
     */
    select?: EmailRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailRecipient
     */
    omit?: EmailRecipientOmit<ExtArgs> | null
    /**
     * Filter which EmailRecipient to delete.
     */
    where: EmailRecipientWhereUniqueInput
  }

  /**
   * EmailRecipient deleteMany
   */
  export type EmailRecipientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailRecipients to delete
     */
    where?: EmailRecipientWhereInput
    /**
     * Limit how many EmailRecipients to delete.
     */
    limit?: number
  }

  /**
   * EmailRecipient without action
   */
  export type EmailRecipientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailRecipient
     */
    select?: EmailRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailRecipient
     */
    omit?: EmailRecipientOmit<ExtArgs> | null
  }


  /**
   * Model SmtpSetting
   */

  export type AggregateSmtpSetting = {
    _count: SmtpSettingCountAggregateOutputType | null
    _avg: SmtpSettingAvgAggregateOutputType | null
    _sum: SmtpSettingSumAggregateOutputType | null
    _min: SmtpSettingMinAggregateOutputType | null
    _max: SmtpSettingMaxAggregateOutputType | null
  }

  export type SmtpSettingAvgAggregateOutputType = {
    id: number | null
  }

  export type SmtpSettingSumAggregateOutputType = {
    id: number | null
  }

  export type SmtpSettingMinAggregateOutputType = {
    id: number | null
    host: string | null
    port: string | null
    user: string | null
    pass: string | null
    globalCcEmail: string | null
  }

  export type SmtpSettingMaxAggregateOutputType = {
    id: number | null
    host: string | null
    port: string | null
    user: string | null
    pass: string | null
    globalCcEmail: string | null
  }

  export type SmtpSettingCountAggregateOutputType = {
    id: number
    host: number
    port: number
    user: number
    pass: number
    globalCcEmail: number
    _all: number
  }


  export type SmtpSettingAvgAggregateInputType = {
    id?: true
  }

  export type SmtpSettingSumAggregateInputType = {
    id?: true
  }

  export type SmtpSettingMinAggregateInputType = {
    id?: true
    host?: true
    port?: true
    user?: true
    pass?: true
    globalCcEmail?: true
  }

  export type SmtpSettingMaxAggregateInputType = {
    id?: true
    host?: true
    port?: true
    user?: true
    pass?: true
    globalCcEmail?: true
  }

  export type SmtpSettingCountAggregateInputType = {
    id?: true
    host?: true
    port?: true
    user?: true
    pass?: true
    globalCcEmail?: true
    _all?: true
  }

  export type SmtpSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SmtpSetting to aggregate.
     */
    where?: SmtpSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmtpSettings to fetch.
     */
    orderBy?: SmtpSettingOrderByWithRelationInput | SmtpSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SmtpSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmtpSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmtpSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SmtpSettings
    **/
    _count?: true | SmtpSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SmtpSettingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SmtpSettingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SmtpSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SmtpSettingMaxAggregateInputType
  }

  export type GetSmtpSettingAggregateType<T extends SmtpSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateSmtpSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSmtpSetting[P]>
      : GetScalarType<T[P], AggregateSmtpSetting[P]>
  }




  export type SmtpSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SmtpSettingWhereInput
    orderBy?: SmtpSettingOrderByWithAggregationInput | SmtpSettingOrderByWithAggregationInput[]
    by: SmtpSettingScalarFieldEnum[] | SmtpSettingScalarFieldEnum
    having?: SmtpSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SmtpSettingCountAggregateInputType | true
    _avg?: SmtpSettingAvgAggregateInputType
    _sum?: SmtpSettingSumAggregateInputType
    _min?: SmtpSettingMinAggregateInputType
    _max?: SmtpSettingMaxAggregateInputType
  }

  export type SmtpSettingGroupByOutputType = {
    id: number
    host: string | null
    port: string | null
    user: string | null
    pass: string | null
    globalCcEmail: string | null
    _count: SmtpSettingCountAggregateOutputType | null
    _avg: SmtpSettingAvgAggregateOutputType | null
    _sum: SmtpSettingSumAggregateOutputType | null
    _min: SmtpSettingMinAggregateOutputType | null
    _max: SmtpSettingMaxAggregateOutputType | null
  }

  type GetSmtpSettingGroupByPayload<T extends SmtpSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SmtpSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SmtpSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SmtpSettingGroupByOutputType[P]>
            : GetScalarType<T[P], SmtpSettingGroupByOutputType[P]>
        }
      >
    >


  export type SmtpSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    host?: boolean
    port?: boolean
    user?: boolean
    pass?: boolean
    globalCcEmail?: boolean
  }, ExtArgs["result"]["smtpSetting"]>



  export type SmtpSettingSelectScalar = {
    id?: boolean
    host?: boolean
    port?: boolean
    user?: boolean
    pass?: boolean
    globalCcEmail?: boolean
  }

  export type SmtpSettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "host" | "port" | "user" | "pass" | "globalCcEmail", ExtArgs["result"]["smtpSetting"]>

  export type $SmtpSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SmtpSetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      host: string | null
      port: string | null
      user: string | null
      pass: string | null
      globalCcEmail: string | null
    }, ExtArgs["result"]["smtpSetting"]>
    composites: {}
  }

  type SmtpSettingGetPayload<S extends boolean | null | undefined | SmtpSettingDefaultArgs> = $Result.GetResult<Prisma.$SmtpSettingPayload, S>

  type SmtpSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SmtpSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SmtpSettingCountAggregateInputType | true
    }

  export interface SmtpSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SmtpSetting'], meta: { name: 'SmtpSetting' } }
    /**
     * Find zero or one SmtpSetting that matches the filter.
     * @param {SmtpSettingFindUniqueArgs} args - Arguments to find a SmtpSetting
     * @example
     * // Get one SmtpSetting
     * const smtpSetting = await prisma.smtpSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SmtpSettingFindUniqueArgs>(args: SelectSubset<T, SmtpSettingFindUniqueArgs<ExtArgs>>): Prisma__SmtpSettingClient<$Result.GetResult<Prisma.$SmtpSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SmtpSetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SmtpSettingFindUniqueOrThrowArgs} args - Arguments to find a SmtpSetting
     * @example
     * // Get one SmtpSetting
     * const smtpSetting = await prisma.smtpSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SmtpSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, SmtpSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SmtpSettingClient<$Result.GetResult<Prisma.$SmtpSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SmtpSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpSettingFindFirstArgs} args - Arguments to find a SmtpSetting
     * @example
     * // Get one SmtpSetting
     * const smtpSetting = await prisma.smtpSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SmtpSettingFindFirstArgs>(args?: SelectSubset<T, SmtpSettingFindFirstArgs<ExtArgs>>): Prisma__SmtpSettingClient<$Result.GetResult<Prisma.$SmtpSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SmtpSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpSettingFindFirstOrThrowArgs} args - Arguments to find a SmtpSetting
     * @example
     * // Get one SmtpSetting
     * const smtpSetting = await prisma.smtpSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SmtpSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, SmtpSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__SmtpSettingClient<$Result.GetResult<Prisma.$SmtpSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SmtpSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SmtpSettings
     * const smtpSettings = await prisma.smtpSetting.findMany()
     * 
     * // Get first 10 SmtpSettings
     * const smtpSettings = await prisma.smtpSetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const smtpSettingWithIdOnly = await prisma.smtpSetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SmtpSettingFindManyArgs>(args?: SelectSubset<T, SmtpSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SmtpSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SmtpSetting.
     * @param {SmtpSettingCreateArgs} args - Arguments to create a SmtpSetting.
     * @example
     * // Create one SmtpSetting
     * const SmtpSetting = await prisma.smtpSetting.create({
     *   data: {
     *     // ... data to create a SmtpSetting
     *   }
     * })
     * 
     */
    create<T extends SmtpSettingCreateArgs>(args: SelectSubset<T, SmtpSettingCreateArgs<ExtArgs>>): Prisma__SmtpSettingClient<$Result.GetResult<Prisma.$SmtpSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SmtpSettings.
     * @param {SmtpSettingCreateManyArgs} args - Arguments to create many SmtpSettings.
     * @example
     * // Create many SmtpSettings
     * const smtpSetting = await prisma.smtpSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SmtpSettingCreateManyArgs>(args?: SelectSubset<T, SmtpSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SmtpSetting.
     * @param {SmtpSettingDeleteArgs} args - Arguments to delete one SmtpSetting.
     * @example
     * // Delete one SmtpSetting
     * const SmtpSetting = await prisma.smtpSetting.delete({
     *   where: {
     *     // ... filter to delete one SmtpSetting
     *   }
     * })
     * 
     */
    delete<T extends SmtpSettingDeleteArgs>(args: SelectSubset<T, SmtpSettingDeleteArgs<ExtArgs>>): Prisma__SmtpSettingClient<$Result.GetResult<Prisma.$SmtpSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SmtpSetting.
     * @param {SmtpSettingUpdateArgs} args - Arguments to update one SmtpSetting.
     * @example
     * // Update one SmtpSetting
     * const smtpSetting = await prisma.smtpSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SmtpSettingUpdateArgs>(args: SelectSubset<T, SmtpSettingUpdateArgs<ExtArgs>>): Prisma__SmtpSettingClient<$Result.GetResult<Prisma.$SmtpSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SmtpSettings.
     * @param {SmtpSettingDeleteManyArgs} args - Arguments to filter SmtpSettings to delete.
     * @example
     * // Delete a few SmtpSettings
     * const { count } = await prisma.smtpSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SmtpSettingDeleteManyArgs>(args?: SelectSubset<T, SmtpSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SmtpSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SmtpSettings
     * const smtpSetting = await prisma.smtpSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SmtpSettingUpdateManyArgs>(args: SelectSubset<T, SmtpSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SmtpSetting.
     * @param {SmtpSettingUpsertArgs} args - Arguments to update or create a SmtpSetting.
     * @example
     * // Update or create a SmtpSetting
     * const smtpSetting = await prisma.smtpSetting.upsert({
     *   create: {
     *     // ... data to create a SmtpSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SmtpSetting we want to update
     *   }
     * })
     */
    upsert<T extends SmtpSettingUpsertArgs>(args: SelectSubset<T, SmtpSettingUpsertArgs<ExtArgs>>): Prisma__SmtpSettingClient<$Result.GetResult<Prisma.$SmtpSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SmtpSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpSettingCountArgs} args - Arguments to filter SmtpSettings to count.
     * @example
     * // Count the number of SmtpSettings
     * const count = await prisma.smtpSetting.count({
     *   where: {
     *     // ... the filter for the SmtpSettings we want to count
     *   }
     * })
    **/
    count<T extends SmtpSettingCountArgs>(
      args?: Subset<T, SmtpSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SmtpSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SmtpSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SmtpSettingAggregateArgs>(args: Subset<T, SmtpSettingAggregateArgs>): Prisma.PrismaPromise<GetSmtpSettingAggregateType<T>>

    /**
     * Group by SmtpSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SmtpSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SmtpSettingGroupByArgs['orderBy'] }
        : { orderBy?: SmtpSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SmtpSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSmtpSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SmtpSetting model
   */
  readonly fields: SmtpSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SmtpSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SmtpSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SmtpSetting model
   */
  interface SmtpSettingFieldRefs {
    readonly id: FieldRef<"SmtpSetting", 'Int'>
    readonly host: FieldRef<"SmtpSetting", 'String'>
    readonly port: FieldRef<"SmtpSetting", 'String'>
    readonly user: FieldRef<"SmtpSetting", 'String'>
    readonly pass: FieldRef<"SmtpSetting", 'String'>
    readonly globalCcEmail: FieldRef<"SmtpSetting", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SmtpSetting findUnique
   */
  export type SmtpSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpSetting
     */
    select?: SmtpSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpSetting
     */
    omit?: SmtpSettingOmit<ExtArgs> | null
    /**
     * Filter, which SmtpSetting to fetch.
     */
    where: SmtpSettingWhereUniqueInput
  }

  /**
   * SmtpSetting findUniqueOrThrow
   */
  export type SmtpSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpSetting
     */
    select?: SmtpSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpSetting
     */
    omit?: SmtpSettingOmit<ExtArgs> | null
    /**
     * Filter, which SmtpSetting to fetch.
     */
    where: SmtpSettingWhereUniqueInput
  }

  /**
   * SmtpSetting findFirst
   */
  export type SmtpSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpSetting
     */
    select?: SmtpSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpSetting
     */
    omit?: SmtpSettingOmit<ExtArgs> | null
    /**
     * Filter, which SmtpSetting to fetch.
     */
    where?: SmtpSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmtpSettings to fetch.
     */
    orderBy?: SmtpSettingOrderByWithRelationInput | SmtpSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SmtpSettings.
     */
    cursor?: SmtpSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmtpSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmtpSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SmtpSettings.
     */
    distinct?: SmtpSettingScalarFieldEnum | SmtpSettingScalarFieldEnum[]
  }

  /**
   * SmtpSetting findFirstOrThrow
   */
  export type SmtpSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpSetting
     */
    select?: SmtpSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpSetting
     */
    omit?: SmtpSettingOmit<ExtArgs> | null
    /**
     * Filter, which SmtpSetting to fetch.
     */
    where?: SmtpSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmtpSettings to fetch.
     */
    orderBy?: SmtpSettingOrderByWithRelationInput | SmtpSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SmtpSettings.
     */
    cursor?: SmtpSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmtpSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmtpSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SmtpSettings.
     */
    distinct?: SmtpSettingScalarFieldEnum | SmtpSettingScalarFieldEnum[]
  }

  /**
   * SmtpSetting findMany
   */
  export type SmtpSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpSetting
     */
    select?: SmtpSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpSetting
     */
    omit?: SmtpSettingOmit<ExtArgs> | null
    /**
     * Filter, which SmtpSettings to fetch.
     */
    where?: SmtpSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmtpSettings to fetch.
     */
    orderBy?: SmtpSettingOrderByWithRelationInput | SmtpSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SmtpSettings.
     */
    cursor?: SmtpSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmtpSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmtpSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SmtpSettings.
     */
    distinct?: SmtpSettingScalarFieldEnum | SmtpSettingScalarFieldEnum[]
  }

  /**
   * SmtpSetting create
   */
  export type SmtpSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpSetting
     */
    select?: SmtpSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpSetting
     */
    omit?: SmtpSettingOmit<ExtArgs> | null
    /**
     * The data needed to create a SmtpSetting.
     */
    data?: XOR<SmtpSettingCreateInput, SmtpSettingUncheckedCreateInput>
  }

  /**
   * SmtpSetting createMany
   */
  export type SmtpSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SmtpSettings.
     */
    data: SmtpSettingCreateManyInput | SmtpSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SmtpSetting update
   */
  export type SmtpSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpSetting
     */
    select?: SmtpSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpSetting
     */
    omit?: SmtpSettingOmit<ExtArgs> | null
    /**
     * The data needed to update a SmtpSetting.
     */
    data: XOR<SmtpSettingUpdateInput, SmtpSettingUncheckedUpdateInput>
    /**
     * Choose, which SmtpSetting to update.
     */
    where: SmtpSettingWhereUniqueInput
  }

  /**
   * SmtpSetting updateMany
   */
  export type SmtpSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SmtpSettings.
     */
    data: XOR<SmtpSettingUpdateManyMutationInput, SmtpSettingUncheckedUpdateManyInput>
    /**
     * Filter which SmtpSettings to update
     */
    where?: SmtpSettingWhereInput
    /**
     * Limit how many SmtpSettings to update.
     */
    limit?: number
  }

  /**
   * SmtpSetting upsert
   */
  export type SmtpSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpSetting
     */
    select?: SmtpSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpSetting
     */
    omit?: SmtpSettingOmit<ExtArgs> | null
    /**
     * The filter to search for the SmtpSetting to update in case it exists.
     */
    where: SmtpSettingWhereUniqueInput
    /**
     * In case the SmtpSetting found by the `where` argument doesn't exist, create a new SmtpSetting with this data.
     */
    create: XOR<SmtpSettingCreateInput, SmtpSettingUncheckedCreateInput>
    /**
     * In case the SmtpSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SmtpSettingUpdateInput, SmtpSettingUncheckedUpdateInput>
  }

  /**
   * SmtpSetting delete
   */
  export type SmtpSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpSetting
     */
    select?: SmtpSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpSetting
     */
    omit?: SmtpSettingOmit<ExtArgs> | null
    /**
     * Filter which SmtpSetting to delete.
     */
    where: SmtpSettingWhereUniqueInput
  }

  /**
   * SmtpSetting deleteMany
   */
  export type SmtpSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SmtpSettings to delete
     */
    where?: SmtpSettingWhereInput
    /**
     * Limit how many SmtpSettings to delete.
     */
    limit?: number
  }

  /**
   * SmtpSetting without action
   */
  export type SmtpSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpSetting
     */
    select?: SmtpSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpSetting
     */
    omit?: SmtpSettingOmit<ExtArgs> | null
  }


  /**
   * Model SmtpConfig
   */

  export type AggregateSmtpConfig = {
    _count: SmtpConfigCountAggregateOutputType | null
    _avg: SmtpConfigAvgAggregateOutputType | null
    _sum: SmtpConfigSumAggregateOutputType | null
    _min: SmtpConfigMinAggregateOutputType | null
    _max: SmtpConfigMaxAggregateOutputType | null
  }

  export type SmtpConfigAvgAggregateOutputType = {
    id: number | null
    port: number | null
  }

  export type SmtpConfigSumAggregateOutputType = {
    id: number | null
    port: number | null
  }

  export type SmtpConfigMinAggregateOutputType = {
    id: number | null
    host: string | null
    port: number | null
    username: string | null
    password: string | null
    globalCcEmail: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SmtpConfigMaxAggregateOutputType = {
    id: number | null
    host: string | null
    port: number | null
    username: string | null
    password: string | null
    globalCcEmail: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SmtpConfigCountAggregateOutputType = {
    id: number
    host: number
    port: number
    username: number
    password: number
    globalCcEmail: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SmtpConfigAvgAggregateInputType = {
    id?: true
    port?: true
  }

  export type SmtpConfigSumAggregateInputType = {
    id?: true
    port?: true
  }

  export type SmtpConfigMinAggregateInputType = {
    id?: true
    host?: true
    port?: true
    username?: true
    password?: true
    globalCcEmail?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SmtpConfigMaxAggregateInputType = {
    id?: true
    host?: true
    port?: true
    username?: true
    password?: true
    globalCcEmail?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SmtpConfigCountAggregateInputType = {
    id?: true
    host?: true
    port?: true
    username?: true
    password?: true
    globalCcEmail?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SmtpConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SmtpConfig to aggregate.
     */
    where?: SmtpConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmtpConfigs to fetch.
     */
    orderBy?: SmtpConfigOrderByWithRelationInput | SmtpConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SmtpConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmtpConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmtpConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SmtpConfigs
    **/
    _count?: true | SmtpConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SmtpConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SmtpConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SmtpConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SmtpConfigMaxAggregateInputType
  }

  export type GetSmtpConfigAggregateType<T extends SmtpConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateSmtpConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSmtpConfig[P]>
      : GetScalarType<T[P], AggregateSmtpConfig[P]>
  }




  export type SmtpConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SmtpConfigWhereInput
    orderBy?: SmtpConfigOrderByWithAggregationInput | SmtpConfigOrderByWithAggregationInput[]
    by: SmtpConfigScalarFieldEnum[] | SmtpConfigScalarFieldEnum
    having?: SmtpConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SmtpConfigCountAggregateInputType | true
    _avg?: SmtpConfigAvgAggregateInputType
    _sum?: SmtpConfigSumAggregateInputType
    _min?: SmtpConfigMinAggregateInputType
    _max?: SmtpConfigMaxAggregateInputType
  }

  export type SmtpConfigGroupByOutputType = {
    id: number
    host: string
    port: number
    username: string
    password: string
    globalCcEmail: string | null
    createdAt: Date
    updatedAt: Date
    _count: SmtpConfigCountAggregateOutputType | null
    _avg: SmtpConfigAvgAggregateOutputType | null
    _sum: SmtpConfigSumAggregateOutputType | null
    _min: SmtpConfigMinAggregateOutputType | null
    _max: SmtpConfigMaxAggregateOutputType | null
  }

  type GetSmtpConfigGroupByPayload<T extends SmtpConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SmtpConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SmtpConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SmtpConfigGroupByOutputType[P]>
            : GetScalarType<T[P], SmtpConfigGroupByOutputType[P]>
        }
      >
    >


  export type SmtpConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    host?: boolean
    port?: boolean
    username?: boolean
    password?: boolean
    globalCcEmail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["smtpConfig"]>



  export type SmtpConfigSelectScalar = {
    id?: boolean
    host?: boolean
    port?: boolean
    username?: boolean
    password?: boolean
    globalCcEmail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SmtpConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "host" | "port" | "username" | "password" | "globalCcEmail" | "createdAt" | "updatedAt", ExtArgs["result"]["smtpConfig"]>

  export type $SmtpConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SmtpConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      host: string
      port: number
      username: string
      password: string
      globalCcEmail: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["smtpConfig"]>
    composites: {}
  }

  type SmtpConfigGetPayload<S extends boolean | null | undefined | SmtpConfigDefaultArgs> = $Result.GetResult<Prisma.$SmtpConfigPayload, S>

  type SmtpConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SmtpConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SmtpConfigCountAggregateInputType | true
    }

  export interface SmtpConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SmtpConfig'], meta: { name: 'SmtpConfig' } }
    /**
     * Find zero or one SmtpConfig that matches the filter.
     * @param {SmtpConfigFindUniqueArgs} args - Arguments to find a SmtpConfig
     * @example
     * // Get one SmtpConfig
     * const smtpConfig = await prisma.smtpConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SmtpConfigFindUniqueArgs>(args: SelectSubset<T, SmtpConfigFindUniqueArgs<ExtArgs>>): Prisma__SmtpConfigClient<$Result.GetResult<Prisma.$SmtpConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SmtpConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SmtpConfigFindUniqueOrThrowArgs} args - Arguments to find a SmtpConfig
     * @example
     * // Get one SmtpConfig
     * const smtpConfig = await prisma.smtpConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SmtpConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, SmtpConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SmtpConfigClient<$Result.GetResult<Prisma.$SmtpConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SmtpConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpConfigFindFirstArgs} args - Arguments to find a SmtpConfig
     * @example
     * // Get one SmtpConfig
     * const smtpConfig = await prisma.smtpConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SmtpConfigFindFirstArgs>(args?: SelectSubset<T, SmtpConfigFindFirstArgs<ExtArgs>>): Prisma__SmtpConfigClient<$Result.GetResult<Prisma.$SmtpConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SmtpConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpConfigFindFirstOrThrowArgs} args - Arguments to find a SmtpConfig
     * @example
     * // Get one SmtpConfig
     * const smtpConfig = await prisma.smtpConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SmtpConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, SmtpConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__SmtpConfigClient<$Result.GetResult<Prisma.$SmtpConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SmtpConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SmtpConfigs
     * const smtpConfigs = await prisma.smtpConfig.findMany()
     * 
     * // Get first 10 SmtpConfigs
     * const smtpConfigs = await prisma.smtpConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const smtpConfigWithIdOnly = await prisma.smtpConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SmtpConfigFindManyArgs>(args?: SelectSubset<T, SmtpConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SmtpConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SmtpConfig.
     * @param {SmtpConfigCreateArgs} args - Arguments to create a SmtpConfig.
     * @example
     * // Create one SmtpConfig
     * const SmtpConfig = await prisma.smtpConfig.create({
     *   data: {
     *     // ... data to create a SmtpConfig
     *   }
     * })
     * 
     */
    create<T extends SmtpConfigCreateArgs>(args: SelectSubset<T, SmtpConfigCreateArgs<ExtArgs>>): Prisma__SmtpConfigClient<$Result.GetResult<Prisma.$SmtpConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SmtpConfigs.
     * @param {SmtpConfigCreateManyArgs} args - Arguments to create many SmtpConfigs.
     * @example
     * // Create many SmtpConfigs
     * const smtpConfig = await prisma.smtpConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SmtpConfigCreateManyArgs>(args?: SelectSubset<T, SmtpConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SmtpConfig.
     * @param {SmtpConfigDeleteArgs} args - Arguments to delete one SmtpConfig.
     * @example
     * // Delete one SmtpConfig
     * const SmtpConfig = await prisma.smtpConfig.delete({
     *   where: {
     *     // ... filter to delete one SmtpConfig
     *   }
     * })
     * 
     */
    delete<T extends SmtpConfigDeleteArgs>(args: SelectSubset<T, SmtpConfigDeleteArgs<ExtArgs>>): Prisma__SmtpConfigClient<$Result.GetResult<Prisma.$SmtpConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SmtpConfig.
     * @param {SmtpConfigUpdateArgs} args - Arguments to update one SmtpConfig.
     * @example
     * // Update one SmtpConfig
     * const smtpConfig = await prisma.smtpConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SmtpConfigUpdateArgs>(args: SelectSubset<T, SmtpConfigUpdateArgs<ExtArgs>>): Prisma__SmtpConfigClient<$Result.GetResult<Prisma.$SmtpConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SmtpConfigs.
     * @param {SmtpConfigDeleteManyArgs} args - Arguments to filter SmtpConfigs to delete.
     * @example
     * // Delete a few SmtpConfigs
     * const { count } = await prisma.smtpConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SmtpConfigDeleteManyArgs>(args?: SelectSubset<T, SmtpConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SmtpConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SmtpConfigs
     * const smtpConfig = await prisma.smtpConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SmtpConfigUpdateManyArgs>(args: SelectSubset<T, SmtpConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SmtpConfig.
     * @param {SmtpConfigUpsertArgs} args - Arguments to update or create a SmtpConfig.
     * @example
     * // Update or create a SmtpConfig
     * const smtpConfig = await prisma.smtpConfig.upsert({
     *   create: {
     *     // ... data to create a SmtpConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SmtpConfig we want to update
     *   }
     * })
     */
    upsert<T extends SmtpConfigUpsertArgs>(args: SelectSubset<T, SmtpConfigUpsertArgs<ExtArgs>>): Prisma__SmtpConfigClient<$Result.GetResult<Prisma.$SmtpConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SmtpConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpConfigCountArgs} args - Arguments to filter SmtpConfigs to count.
     * @example
     * // Count the number of SmtpConfigs
     * const count = await prisma.smtpConfig.count({
     *   where: {
     *     // ... the filter for the SmtpConfigs we want to count
     *   }
     * })
    **/
    count<T extends SmtpConfigCountArgs>(
      args?: Subset<T, SmtpConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SmtpConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SmtpConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SmtpConfigAggregateArgs>(args: Subset<T, SmtpConfigAggregateArgs>): Prisma.PrismaPromise<GetSmtpConfigAggregateType<T>>

    /**
     * Group by SmtpConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SmtpConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SmtpConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SmtpConfigGroupByArgs['orderBy'] }
        : { orderBy?: SmtpConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SmtpConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSmtpConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SmtpConfig model
   */
  readonly fields: SmtpConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SmtpConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SmtpConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SmtpConfig model
   */
  interface SmtpConfigFieldRefs {
    readonly id: FieldRef<"SmtpConfig", 'Int'>
    readonly host: FieldRef<"SmtpConfig", 'String'>
    readonly port: FieldRef<"SmtpConfig", 'Int'>
    readonly username: FieldRef<"SmtpConfig", 'String'>
    readonly password: FieldRef<"SmtpConfig", 'String'>
    readonly globalCcEmail: FieldRef<"SmtpConfig", 'String'>
    readonly createdAt: FieldRef<"SmtpConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"SmtpConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SmtpConfig findUnique
   */
  export type SmtpConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpConfig
     */
    select?: SmtpConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpConfig
     */
    omit?: SmtpConfigOmit<ExtArgs> | null
    /**
     * Filter, which SmtpConfig to fetch.
     */
    where: SmtpConfigWhereUniqueInput
  }

  /**
   * SmtpConfig findUniqueOrThrow
   */
  export type SmtpConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpConfig
     */
    select?: SmtpConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpConfig
     */
    omit?: SmtpConfigOmit<ExtArgs> | null
    /**
     * Filter, which SmtpConfig to fetch.
     */
    where: SmtpConfigWhereUniqueInput
  }

  /**
   * SmtpConfig findFirst
   */
  export type SmtpConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpConfig
     */
    select?: SmtpConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpConfig
     */
    omit?: SmtpConfigOmit<ExtArgs> | null
    /**
     * Filter, which SmtpConfig to fetch.
     */
    where?: SmtpConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmtpConfigs to fetch.
     */
    orderBy?: SmtpConfigOrderByWithRelationInput | SmtpConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SmtpConfigs.
     */
    cursor?: SmtpConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmtpConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmtpConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SmtpConfigs.
     */
    distinct?: SmtpConfigScalarFieldEnum | SmtpConfigScalarFieldEnum[]
  }

  /**
   * SmtpConfig findFirstOrThrow
   */
  export type SmtpConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpConfig
     */
    select?: SmtpConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpConfig
     */
    omit?: SmtpConfigOmit<ExtArgs> | null
    /**
     * Filter, which SmtpConfig to fetch.
     */
    where?: SmtpConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmtpConfigs to fetch.
     */
    orderBy?: SmtpConfigOrderByWithRelationInput | SmtpConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SmtpConfigs.
     */
    cursor?: SmtpConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmtpConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmtpConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SmtpConfigs.
     */
    distinct?: SmtpConfigScalarFieldEnum | SmtpConfigScalarFieldEnum[]
  }

  /**
   * SmtpConfig findMany
   */
  export type SmtpConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpConfig
     */
    select?: SmtpConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpConfig
     */
    omit?: SmtpConfigOmit<ExtArgs> | null
    /**
     * Filter, which SmtpConfigs to fetch.
     */
    where?: SmtpConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SmtpConfigs to fetch.
     */
    orderBy?: SmtpConfigOrderByWithRelationInput | SmtpConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SmtpConfigs.
     */
    cursor?: SmtpConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SmtpConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SmtpConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SmtpConfigs.
     */
    distinct?: SmtpConfigScalarFieldEnum | SmtpConfigScalarFieldEnum[]
  }

  /**
   * SmtpConfig create
   */
  export type SmtpConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpConfig
     */
    select?: SmtpConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpConfig
     */
    omit?: SmtpConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a SmtpConfig.
     */
    data: XOR<SmtpConfigCreateInput, SmtpConfigUncheckedCreateInput>
  }

  /**
   * SmtpConfig createMany
   */
  export type SmtpConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SmtpConfigs.
     */
    data: SmtpConfigCreateManyInput | SmtpConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SmtpConfig update
   */
  export type SmtpConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpConfig
     */
    select?: SmtpConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpConfig
     */
    omit?: SmtpConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a SmtpConfig.
     */
    data: XOR<SmtpConfigUpdateInput, SmtpConfigUncheckedUpdateInput>
    /**
     * Choose, which SmtpConfig to update.
     */
    where: SmtpConfigWhereUniqueInput
  }

  /**
   * SmtpConfig updateMany
   */
  export type SmtpConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SmtpConfigs.
     */
    data: XOR<SmtpConfigUpdateManyMutationInput, SmtpConfigUncheckedUpdateManyInput>
    /**
     * Filter which SmtpConfigs to update
     */
    where?: SmtpConfigWhereInput
    /**
     * Limit how many SmtpConfigs to update.
     */
    limit?: number
  }

  /**
   * SmtpConfig upsert
   */
  export type SmtpConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpConfig
     */
    select?: SmtpConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpConfig
     */
    omit?: SmtpConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the SmtpConfig to update in case it exists.
     */
    where: SmtpConfigWhereUniqueInput
    /**
     * In case the SmtpConfig found by the `where` argument doesn't exist, create a new SmtpConfig with this data.
     */
    create: XOR<SmtpConfigCreateInput, SmtpConfigUncheckedCreateInput>
    /**
     * In case the SmtpConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SmtpConfigUpdateInput, SmtpConfigUncheckedUpdateInput>
  }

  /**
   * SmtpConfig delete
   */
  export type SmtpConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpConfig
     */
    select?: SmtpConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpConfig
     */
    omit?: SmtpConfigOmit<ExtArgs> | null
    /**
     * Filter which SmtpConfig to delete.
     */
    where: SmtpConfigWhereUniqueInput
  }

  /**
   * SmtpConfig deleteMany
   */
  export type SmtpConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SmtpConfigs to delete
     */
    where?: SmtpConfigWhereInput
    /**
     * Limit how many SmtpConfigs to delete.
     */
    limit?: number
  }

  /**
   * SmtpConfig without action
   */
  export type SmtpConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SmtpConfig
     */
    select?: SmtpConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SmtpConfig
     */
    omit?: SmtpConfigOmit<ExtArgs> | null
  }


  /**
   * Model ScanExecutionLog
   */

  export type AggregateScanExecutionLog = {
    _count: ScanExecutionLogCountAggregateOutputType | null
    _avg: ScanExecutionLogAvgAggregateOutputType | null
    _sum: ScanExecutionLogSumAggregateOutputType | null
    _min: ScanExecutionLogMinAggregateOutputType | null
    _max: ScanExecutionLogMaxAggregateOutputType | null
  }

  export type ScanExecutionLogAvgAggregateOutputType = {
    id: number | null
  }

  export type ScanExecutionLogSumAggregateOutputType = {
    id: number | null
  }

  export type ScanExecutionLogMinAggregateOutputType = {
    id: number | null
    scheduleTime: string | null
    executedAt: Date | null
    status: string | null
    message: string | null
  }

  export type ScanExecutionLogMaxAggregateOutputType = {
    id: number | null
    scheduleTime: string | null
    executedAt: Date | null
    status: string | null
    message: string | null
  }

  export type ScanExecutionLogCountAggregateOutputType = {
    id: number
    scheduleTime: number
    executedAt: number
    status: number
    message: number
    _all: number
  }


  export type ScanExecutionLogAvgAggregateInputType = {
    id?: true
  }

  export type ScanExecutionLogSumAggregateInputType = {
    id?: true
  }

  export type ScanExecutionLogMinAggregateInputType = {
    id?: true
    scheduleTime?: true
    executedAt?: true
    status?: true
    message?: true
  }

  export type ScanExecutionLogMaxAggregateInputType = {
    id?: true
    scheduleTime?: true
    executedAt?: true
    status?: true
    message?: true
  }

  export type ScanExecutionLogCountAggregateInputType = {
    id?: true
    scheduleTime?: true
    executedAt?: true
    status?: true
    message?: true
    _all?: true
  }

  export type ScanExecutionLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScanExecutionLog to aggregate.
     */
    where?: ScanExecutionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScanExecutionLogs to fetch.
     */
    orderBy?: ScanExecutionLogOrderByWithRelationInput | ScanExecutionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScanExecutionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScanExecutionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScanExecutionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScanExecutionLogs
    **/
    _count?: true | ScanExecutionLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScanExecutionLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScanExecutionLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScanExecutionLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScanExecutionLogMaxAggregateInputType
  }

  export type GetScanExecutionLogAggregateType<T extends ScanExecutionLogAggregateArgs> = {
        [P in keyof T & keyof AggregateScanExecutionLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScanExecutionLog[P]>
      : GetScalarType<T[P], AggregateScanExecutionLog[P]>
  }




  export type ScanExecutionLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScanExecutionLogWhereInput
    orderBy?: ScanExecutionLogOrderByWithAggregationInput | ScanExecutionLogOrderByWithAggregationInput[]
    by: ScanExecutionLogScalarFieldEnum[] | ScanExecutionLogScalarFieldEnum
    having?: ScanExecutionLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScanExecutionLogCountAggregateInputType | true
    _avg?: ScanExecutionLogAvgAggregateInputType
    _sum?: ScanExecutionLogSumAggregateInputType
    _min?: ScanExecutionLogMinAggregateInputType
    _max?: ScanExecutionLogMaxAggregateInputType
  }

  export type ScanExecutionLogGroupByOutputType = {
    id: number
    scheduleTime: string
    executedAt: Date
    status: string
    message: string
    _count: ScanExecutionLogCountAggregateOutputType | null
    _avg: ScanExecutionLogAvgAggregateOutputType | null
    _sum: ScanExecutionLogSumAggregateOutputType | null
    _min: ScanExecutionLogMinAggregateOutputType | null
    _max: ScanExecutionLogMaxAggregateOutputType | null
  }

  type GetScanExecutionLogGroupByPayload<T extends ScanExecutionLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScanExecutionLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScanExecutionLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScanExecutionLogGroupByOutputType[P]>
            : GetScalarType<T[P], ScanExecutionLogGroupByOutputType[P]>
        }
      >
    >


  export type ScanExecutionLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    scheduleTime?: boolean
    executedAt?: boolean
    status?: boolean
    message?: boolean
  }, ExtArgs["result"]["scanExecutionLog"]>



  export type ScanExecutionLogSelectScalar = {
    id?: boolean
    scheduleTime?: boolean
    executedAt?: boolean
    status?: boolean
    message?: boolean
  }

  export type ScanExecutionLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "scheduleTime" | "executedAt" | "status" | "message", ExtArgs["result"]["scanExecutionLog"]>

  export type $ScanExecutionLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScanExecutionLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      scheduleTime: string
      executedAt: Date
      status: string
      message: string
    }, ExtArgs["result"]["scanExecutionLog"]>
    composites: {}
  }

  type ScanExecutionLogGetPayload<S extends boolean | null | undefined | ScanExecutionLogDefaultArgs> = $Result.GetResult<Prisma.$ScanExecutionLogPayload, S>

  type ScanExecutionLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScanExecutionLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScanExecutionLogCountAggregateInputType | true
    }

  export interface ScanExecutionLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScanExecutionLog'], meta: { name: 'ScanExecutionLog' } }
    /**
     * Find zero or one ScanExecutionLog that matches the filter.
     * @param {ScanExecutionLogFindUniqueArgs} args - Arguments to find a ScanExecutionLog
     * @example
     * // Get one ScanExecutionLog
     * const scanExecutionLog = await prisma.scanExecutionLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScanExecutionLogFindUniqueArgs>(args: SelectSubset<T, ScanExecutionLogFindUniqueArgs<ExtArgs>>): Prisma__ScanExecutionLogClient<$Result.GetResult<Prisma.$ScanExecutionLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ScanExecutionLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScanExecutionLogFindUniqueOrThrowArgs} args - Arguments to find a ScanExecutionLog
     * @example
     * // Get one ScanExecutionLog
     * const scanExecutionLog = await prisma.scanExecutionLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScanExecutionLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ScanExecutionLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScanExecutionLogClient<$Result.GetResult<Prisma.$ScanExecutionLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScanExecutionLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanExecutionLogFindFirstArgs} args - Arguments to find a ScanExecutionLog
     * @example
     * // Get one ScanExecutionLog
     * const scanExecutionLog = await prisma.scanExecutionLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScanExecutionLogFindFirstArgs>(args?: SelectSubset<T, ScanExecutionLogFindFirstArgs<ExtArgs>>): Prisma__ScanExecutionLogClient<$Result.GetResult<Prisma.$ScanExecutionLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScanExecutionLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanExecutionLogFindFirstOrThrowArgs} args - Arguments to find a ScanExecutionLog
     * @example
     * // Get one ScanExecutionLog
     * const scanExecutionLog = await prisma.scanExecutionLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScanExecutionLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ScanExecutionLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScanExecutionLogClient<$Result.GetResult<Prisma.$ScanExecutionLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScanExecutionLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanExecutionLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScanExecutionLogs
     * const scanExecutionLogs = await prisma.scanExecutionLog.findMany()
     * 
     * // Get first 10 ScanExecutionLogs
     * const scanExecutionLogs = await prisma.scanExecutionLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scanExecutionLogWithIdOnly = await prisma.scanExecutionLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScanExecutionLogFindManyArgs>(args?: SelectSubset<T, ScanExecutionLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScanExecutionLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ScanExecutionLog.
     * @param {ScanExecutionLogCreateArgs} args - Arguments to create a ScanExecutionLog.
     * @example
     * // Create one ScanExecutionLog
     * const ScanExecutionLog = await prisma.scanExecutionLog.create({
     *   data: {
     *     // ... data to create a ScanExecutionLog
     *   }
     * })
     * 
     */
    create<T extends ScanExecutionLogCreateArgs>(args: SelectSubset<T, ScanExecutionLogCreateArgs<ExtArgs>>): Prisma__ScanExecutionLogClient<$Result.GetResult<Prisma.$ScanExecutionLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ScanExecutionLogs.
     * @param {ScanExecutionLogCreateManyArgs} args - Arguments to create many ScanExecutionLogs.
     * @example
     * // Create many ScanExecutionLogs
     * const scanExecutionLog = await prisma.scanExecutionLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScanExecutionLogCreateManyArgs>(args?: SelectSubset<T, ScanExecutionLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ScanExecutionLog.
     * @param {ScanExecutionLogDeleteArgs} args - Arguments to delete one ScanExecutionLog.
     * @example
     * // Delete one ScanExecutionLog
     * const ScanExecutionLog = await prisma.scanExecutionLog.delete({
     *   where: {
     *     // ... filter to delete one ScanExecutionLog
     *   }
     * })
     * 
     */
    delete<T extends ScanExecutionLogDeleteArgs>(args: SelectSubset<T, ScanExecutionLogDeleteArgs<ExtArgs>>): Prisma__ScanExecutionLogClient<$Result.GetResult<Prisma.$ScanExecutionLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ScanExecutionLog.
     * @param {ScanExecutionLogUpdateArgs} args - Arguments to update one ScanExecutionLog.
     * @example
     * // Update one ScanExecutionLog
     * const scanExecutionLog = await prisma.scanExecutionLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScanExecutionLogUpdateArgs>(args: SelectSubset<T, ScanExecutionLogUpdateArgs<ExtArgs>>): Prisma__ScanExecutionLogClient<$Result.GetResult<Prisma.$ScanExecutionLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ScanExecutionLogs.
     * @param {ScanExecutionLogDeleteManyArgs} args - Arguments to filter ScanExecutionLogs to delete.
     * @example
     * // Delete a few ScanExecutionLogs
     * const { count } = await prisma.scanExecutionLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScanExecutionLogDeleteManyArgs>(args?: SelectSubset<T, ScanExecutionLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScanExecutionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanExecutionLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScanExecutionLogs
     * const scanExecutionLog = await prisma.scanExecutionLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScanExecutionLogUpdateManyArgs>(args: SelectSubset<T, ScanExecutionLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ScanExecutionLog.
     * @param {ScanExecutionLogUpsertArgs} args - Arguments to update or create a ScanExecutionLog.
     * @example
     * // Update or create a ScanExecutionLog
     * const scanExecutionLog = await prisma.scanExecutionLog.upsert({
     *   create: {
     *     // ... data to create a ScanExecutionLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScanExecutionLog we want to update
     *   }
     * })
     */
    upsert<T extends ScanExecutionLogUpsertArgs>(args: SelectSubset<T, ScanExecutionLogUpsertArgs<ExtArgs>>): Prisma__ScanExecutionLogClient<$Result.GetResult<Prisma.$ScanExecutionLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ScanExecutionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanExecutionLogCountArgs} args - Arguments to filter ScanExecutionLogs to count.
     * @example
     * // Count the number of ScanExecutionLogs
     * const count = await prisma.scanExecutionLog.count({
     *   where: {
     *     // ... the filter for the ScanExecutionLogs we want to count
     *   }
     * })
    **/
    count<T extends ScanExecutionLogCountArgs>(
      args?: Subset<T, ScanExecutionLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScanExecutionLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScanExecutionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanExecutionLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScanExecutionLogAggregateArgs>(args: Subset<T, ScanExecutionLogAggregateArgs>): Prisma.PrismaPromise<GetScanExecutionLogAggregateType<T>>

    /**
     * Group by ScanExecutionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScanExecutionLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScanExecutionLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScanExecutionLogGroupByArgs['orderBy'] }
        : { orderBy?: ScanExecutionLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScanExecutionLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScanExecutionLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScanExecutionLog model
   */
  readonly fields: ScanExecutionLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScanExecutionLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScanExecutionLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ScanExecutionLog model
   */
  interface ScanExecutionLogFieldRefs {
    readonly id: FieldRef<"ScanExecutionLog", 'Int'>
    readonly scheduleTime: FieldRef<"ScanExecutionLog", 'String'>
    readonly executedAt: FieldRef<"ScanExecutionLog", 'DateTime'>
    readonly status: FieldRef<"ScanExecutionLog", 'String'>
    readonly message: FieldRef<"ScanExecutionLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ScanExecutionLog findUnique
   */
  export type ScanExecutionLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanExecutionLog
     */
    select?: ScanExecutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanExecutionLog
     */
    omit?: ScanExecutionLogOmit<ExtArgs> | null
    /**
     * Filter, which ScanExecutionLog to fetch.
     */
    where: ScanExecutionLogWhereUniqueInput
  }

  /**
   * ScanExecutionLog findUniqueOrThrow
   */
  export type ScanExecutionLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanExecutionLog
     */
    select?: ScanExecutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanExecutionLog
     */
    omit?: ScanExecutionLogOmit<ExtArgs> | null
    /**
     * Filter, which ScanExecutionLog to fetch.
     */
    where: ScanExecutionLogWhereUniqueInput
  }

  /**
   * ScanExecutionLog findFirst
   */
  export type ScanExecutionLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanExecutionLog
     */
    select?: ScanExecutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanExecutionLog
     */
    omit?: ScanExecutionLogOmit<ExtArgs> | null
    /**
     * Filter, which ScanExecutionLog to fetch.
     */
    where?: ScanExecutionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScanExecutionLogs to fetch.
     */
    orderBy?: ScanExecutionLogOrderByWithRelationInput | ScanExecutionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScanExecutionLogs.
     */
    cursor?: ScanExecutionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScanExecutionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScanExecutionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScanExecutionLogs.
     */
    distinct?: ScanExecutionLogScalarFieldEnum | ScanExecutionLogScalarFieldEnum[]
  }

  /**
   * ScanExecutionLog findFirstOrThrow
   */
  export type ScanExecutionLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanExecutionLog
     */
    select?: ScanExecutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanExecutionLog
     */
    omit?: ScanExecutionLogOmit<ExtArgs> | null
    /**
     * Filter, which ScanExecutionLog to fetch.
     */
    where?: ScanExecutionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScanExecutionLogs to fetch.
     */
    orderBy?: ScanExecutionLogOrderByWithRelationInput | ScanExecutionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScanExecutionLogs.
     */
    cursor?: ScanExecutionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScanExecutionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScanExecutionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScanExecutionLogs.
     */
    distinct?: ScanExecutionLogScalarFieldEnum | ScanExecutionLogScalarFieldEnum[]
  }

  /**
   * ScanExecutionLog findMany
   */
  export type ScanExecutionLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanExecutionLog
     */
    select?: ScanExecutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanExecutionLog
     */
    omit?: ScanExecutionLogOmit<ExtArgs> | null
    /**
     * Filter, which ScanExecutionLogs to fetch.
     */
    where?: ScanExecutionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScanExecutionLogs to fetch.
     */
    orderBy?: ScanExecutionLogOrderByWithRelationInput | ScanExecutionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScanExecutionLogs.
     */
    cursor?: ScanExecutionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScanExecutionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScanExecutionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScanExecutionLogs.
     */
    distinct?: ScanExecutionLogScalarFieldEnum | ScanExecutionLogScalarFieldEnum[]
  }

  /**
   * ScanExecutionLog create
   */
  export type ScanExecutionLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanExecutionLog
     */
    select?: ScanExecutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanExecutionLog
     */
    omit?: ScanExecutionLogOmit<ExtArgs> | null
    /**
     * The data needed to create a ScanExecutionLog.
     */
    data: XOR<ScanExecutionLogCreateInput, ScanExecutionLogUncheckedCreateInput>
  }

  /**
   * ScanExecutionLog createMany
   */
  export type ScanExecutionLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScanExecutionLogs.
     */
    data: ScanExecutionLogCreateManyInput | ScanExecutionLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScanExecutionLog update
   */
  export type ScanExecutionLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanExecutionLog
     */
    select?: ScanExecutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanExecutionLog
     */
    omit?: ScanExecutionLogOmit<ExtArgs> | null
    /**
     * The data needed to update a ScanExecutionLog.
     */
    data: XOR<ScanExecutionLogUpdateInput, ScanExecutionLogUncheckedUpdateInput>
    /**
     * Choose, which ScanExecutionLog to update.
     */
    where: ScanExecutionLogWhereUniqueInput
  }

  /**
   * ScanExecutionLog updateMany
   */
  export type ScanExecutionLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScanExecutionLogs.
     */
    data: XOR<ScanExecutionLogUpdateManyMutationInput, ScanExecutionLogUncheckedUpdateManyInput>
    /**
     * Filter which ScanExecutionLogs to update
     */
    where?: ScanExecutionLogWhereInput
    /**
     * Limit how many ScanExecutionLogs to update.
     */
    limit?: number
  }

  /**
   * ScanExecutionLog upsert
   */
  export type ScanExecutionLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanExecutionLog
     */
    select?: ScanExecutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanExecutionLog
     */
    omit?: ScanExecutionLogOmit<ExtArgs> | null
    /**
     * The filter to search for the ScanExecutionLog to update in case it exists.
     */
    where: ScanExecutionLogWhereUniqueInput
    /**
     * In case the ScanExecutionLog found by the `where` argument doesn't exist, create a new ScanExecutionLog with this data.
     */
    create: XOR<ScanExecutionLogCreateInput, ScanExecutionLogUncheckedCreateInput>
    /**
     * In case the ScanExecutionLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScanExecutionLogUpdateInput, ScanExecutionLogUncheckedUpdateInput>
  }

  /**
   * ScanExecutionLog delete
   */
  export type ScanExecutionLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanExecutionLog
     */
    select?: ScanExecutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanExecutionLog
     */
    omit?: ScanExecutionLogOmit<ExtArgs> | null
    /**
     * Filter which ScanExecutionLog to delete.
     */
    where: ScanExecutionLogWhereUniqueInput
  }

  /**
   * ScanExecutionLog deleteMany
   */
  export type ScanExecutionLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScanExecutionLogs to delete
     */
    where?: ScanExecutionLogWhereInput
    /**
     * Limit how many ScanExecutionLogs to delete.
     */
    limit?: number
  }

  /**
   * ScanExecutionLog without action
   */
  export type ScanExecutionLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScanExecutionLog
     */
    select?: ScanExecutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScanExecutionLog
     */
    omit?: ScanExecutionLogOmit<ExtArgs> | null
  }


  /**
   * Model Metric
   */

  export type AggregateMetric = {
    _count: MetricCountAggregateOutputType | null
    _avg: MetricAvgAggregateOutputType | null
    _sum: MetricSumAggregateOutputType | null
    _min: MetricMinAggregateOutputType | null
    _max: MetricMaxAggregateOutputType | null
  }

  export type MetricAvgAggregateOutputType = {
    id: number | null
    websiteId: number | null
    responseTime: number | null
    sslDaysRemaining: number | null
    domainDaysRemaining: number | null
  }

  export type MetricSumAggregateOutputType = {
    id: number | null
    websiteId: bigint | null
    responseTime: number | null
    sslDaysRemaining: number | null
    domainDaysRemaining: number | null
  }

  export type MetricMinAggregateOutputType = {
    id: number | null
    websiteId: bigint | null
    url: string | null
    name: string | null
    timestamp: Date | null
    status: string | null
    responseTime: number | null
    sslStatus: string | null
    sslExpiryDate: Date | null
    sslDaysRemaining: number | null
    sslWarning: boolean | null
    domainExpiryDate: Date | null
    domainDaysRemaining: number | null
    domainWarning: boolean | null
    safeBrowsingStatus: string | null
    malwareStatus: string | null
    phishingStatus: string | null
    blacklistStatus: string | null
    screenshotPath: string | null
  }

  export type MetricMaxAggregateOutputType = {
    id: number | null
    websiteId: bigint | null
    url: string | null
    name: string | null
    timestamp: Date | null
    status: string | null
    responseTime: number | null
    sslStatus: string | null
    sslExpiryDate: Date | null
    sslDaysRemaining: number | null
    sslWarning: boolean | null
    domainExpiryDate: Date | null
    domainDaysRemaining: number | null
    domainWarning: boolean | null
    safeBrowsingStatus: string | null
    malwareStatus: string | null
    phishingStatus: string | null
    blacklistStatus: string | null
    screenshotPath: string | null
  }

  export type MetricCountAggregateOutputType = {
    id: number
    websiteId: number
    url: number
    name: number
    timestamp: number
    status: number
    responseTime: number
    sslStatus: number
    sslExpiryDate: number
    sslDaysRemaining: number
    sslWarning: number
    domainExpiryDate: number
    domainDaysRemaining: number
    domainWarning: number
    safeBrowsingStatus: number
    malwareStatus: number
    phishingStatus: number
    blacklistStatus: number
    screenshotPath: number
    _all: number
  }


  export type MetricAvgAggregateInputType = {
    id?: true
    websiteId?: true
    responseTime?: true
    sslDaysRemaining?: true
    domainDaysRemaining?: true
  }

  export type MetricSumAggregateInputType = {
    id?: true
    websiteId?: true
    responseTime?: true
    sslDaysRemaining?: true
    domainDaysRemaining?: true
  }

  export type MetricMinAggregateInputType = {
    id?: true
    websiteId?: true
    url?: true
    name?: true
    timestamp?: true
    status?: true
    responseTime?: true
    sslStatus?: true
    sslExpiryDate?: true
    sslDaysRemaining?: true
    sslWarning?: true
    domainExpiryDate?: true
    domainDaysRemaining?: true
    domainWarning?: true
    safeBrowsingStatus?: true
    malwareStatus?: true
    phishingStatus?: true
    blacklistStatus?: true
    screenshotPath?: true
  }

  export type MetricMaxAggregateInputType = {
    id?: true
    websiteId?: true
    url?: true
    name?: true
    timestamp?: true
    status?: true
    responseTime?: true
    sslStatus?: true
    sslExpiryDate?: true
    sslDaysRemaining?: true
    sslWarning?: true
    domainExpiryDate?: true
    domainDaysRemaining?: true
    domainWarning?: true
    safeBrowsingStatus?: true
    malwareStatus?: true
    phishingStatus?: true
    blacklistStatus?: true
    screenshotPath?: true
  }

  export type MetricCountAggregateInputType = {
    id?: true
    websiteId?: true
    url?: true
    name?: true
    timestamp?: true
    status?: true
    responseTime?: true
    sslStatus?: true
    sslExpiryDate?: true
    sslDaysRemaining?: true
    sslWarning?: true
    domainExpiryDate?: true
    domainDaysRemaining?: true
    domainWarning?: true
    safeBrowsingStatus?: true
    malwareStatus?: true
    phishingStatus?: true
    blacklistStatus?: true
    screenshotPath?: true
    _all?: true
  }

  export type MetricAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Metric to aggregate.
     */
    where?: MetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metrics to fetch.
     */
    orderBy?: MetricOrderByWithRelationInput | MetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Metrics
    **/
    _count?: true | MetricCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MetricAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MetricSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MetricMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MetricMaxAggregateInputType
  }

  export type GetMetricAggregateType<T extends MetricAggregateArgs> = {
        [P in keyof T & keyof AggregateMetric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMetric[P]>
      : GetScalarType<T[P], AggregateMetric[P]>
  }




  export type MetricGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MetricWhereInput
    orderBy?: MetricOrderByWithAggregationInput | MetricOrderByWithAggregationInput[]
    by: MetricScalarFieldEnum[] | MetricScalarFieldEnum
    having?: MetricScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MetricCountAggregateInputType | true
    _avg?: MetricAvgAggregateInputType
    _sum?: MetricSumAggregateInputType
    _min?: MetricMinAggregateInputType
    _max?: MetricMaxAggregateInputType
  }

  export type MetricGroupByOutputType = {
    id: number
    websiteId: bigint
    url: string
    name: string
    timestamp: Date
    status: string
    responseTime: number | null
    sslStatus: string
    sslExpiryDate: Date | null
    sslDaysRemaining: number | null
    sslWarning: boolean
    domainExpiryDate: Date | null
    domainDaysRemaining: number | null
    domainWarning: boolean
    safeBrowsingStatus: string
    malwareStatus: string
    phishingStatus: string
    blacklistStatus: string
    screenshotPath: string | null
    _count: MetricCountAggregateOutputType | null
    _avg: MetricAvgAggregateOutputType | null
    _sum: MetricSumAggregateOutputType | null
    _min: MetricMinAggregateOutputType | null
    _max: MetricMaxAggregateOutputType | null
  }

  type GetMetricGroupByPayload<T extends MetricGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MetricGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MetricGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MetricGroupByOutputType[P]>
            : GetScalarType<T[P], MetricGroupByOutputType[P]>
        }
      >
    >


  export type MetricSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    websiteId?: boolean
    url?: boolean
    name?: boolean
    timestamp?: boolean
    status?: boolean
    responseTime?: boolean
    sslStatus?: boolean
    sslExpiryDate?: boolean
    sslDaysRemaining?: boolean
    sslWarning?: boolean
    domainExpiryDate?: boolean
    domainDaysRemaining?: boolean
    domainWarning?: boolean
    safeBrowsingStatus?: boolean
    malwareStatus?: boolean
    phishingStatus?: boolean
    blacklistStatus?: boolean
    screenshotPath?: boolean
  }, ExtArgs["result"]["metric"]>



  export type MetricSelectScalar = {
    id?: boolean
    websiteId?: boolean
    url?: boolean
    name?: boolean
    timestamp?: boolean
    status?: boolean
    responseTime?: boolean
    sslStatus?: boolean
    sslExpiryDate?: boolean
    sslDaysRemaining?: boolean
    sslWarning?: boolean
    domainExpiryDate?: boolean
    domainDaysRemaining?: boolean
    domainWarning?: boolean
    safeBrowsingStatus?: boolean
    malwareStatus?: boolean
    phishingStatus?: boolean
    blacklistStatus?: boolean
    screenshotPath?: boolean
  }

  export type MetricOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "websiteId" | "url" | "name" | "timestamp" | "status" | "responseTime" | "sslStatus" | "sslExpiryDate" | "sslDaysRemaining" | "sslWarning" | "domainExpiryDate" | "domainDaysRemaining" | "domainWarning" | "safeBrowsingStatus" | "malwareStatus" | "phishingStatus" | "blacklistStatus" | "screenshotPath", ExtArgs["result"]["metric"]>

  export type $MetricPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Metric"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      websiteId: bigint
      url: string
      name: string
      timestamp: Date
      status: string
      responseTime: number | null
      sslStatus: string
      sslExpiryDate: Date | null
      sslDaysRemaining: number | null
      sslWarning: boolean
      domainExpiryDate: Date | null
      domainDaysRemaining: number | null
      domainWarning: boolean
      safeBrowsingStatus: string
      malwareStatus: string
      phishingStatus: string
      blacklistStatus: string
      screenshotPath: string | null
    }, ExtArgs["result"]["metric"]>
    composites: {}
  }

  type MetricGetPayload<S extends boolean | null | undefined | MetricDefaultArgs> = $Result.GetResult<Prisma.$MetricPayload, S>

  type MetricCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MetricFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MetricCountAggregateInputType | true
    }

  export interface MetricDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Metric'], meta: { name: 'Metric' } }
    /**
     * Find zero or one Metric that matches the filter.
     * @param {MetricFindUniqueArgs} args - Arguments to find a Metric
     * @example
     * // Get one Metric
     * const metric = await prisma.metric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MetricFindUniqueArgs>(args: SelectSubset<T, MetricFindUniqueArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Metric that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MetricFindUniqueOrThrowArgs} args - Arguments to find a Metric
     * @example
     * // Get one Metric
     * const metric = await prisma.metric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MetricFindUniqueOrThrowArgs>(args: SelectSubset<T, MetricFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Metric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricFindFirstArgs} args - Arguments to find a Metric
     * @example
     * // Get one Metric
     * const metric = await prisma.metric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MetricFindFirstArgs>(args?: SelectSubset<T, MetricFindFirstArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Metric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricFindFirstOrThrowArgs} args - Arguments to find a Metric
     * @example
     * // Get one Metric
     * const metric = await prisma.metric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MetricFindFirstOrThrowArgs>(args?: SelectSubset<T, MetricFindFirstOrThrowArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Metrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Metrics
     * const metrics = await prisma.metric.findMany()
     * 
     * // Get first 10 Metrics
     * const metrics = await prisma.metric.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const metricWithIdOnly = await prisma.metric.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MetricFindManyArgs>(args?: SelectSubset<T, MetricFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Metric.
     * @param {MetricCreateArgs} args - Arguments to create a Metric.
     * @example
     * // Create one Metric
     * const Metric = await prisma.metric.create({
     *   data: {
     *     // ... data to create a Metric
     *   }
     * })
     * 
     */
    create<T extends MetricCreateArgs>(args: SelectSubset<T, MetricCreateArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Metrics.
     * @param {MetricCreateManyArgs} args - Arguments to create many Metrics.
     * @example
     * // Create many Metrics
     * const metric = await prisma.metric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MetricCreateManyArgs>(args?: SelectSubset<T, MetricCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Metric.
     * @param {MetricDeleteArgs} args - Arguments to delete one Metric.
     * @example
     * // Delete one Metric
     * const Metric = await prisma.metric.delete({
     *   where: {
     *     // ... filter to delete one Metric
     *   }
     * })
     * 
     */
    delete<T extends MetricDeleteArgs>(args: SelectSubset<T, MetricDeleteArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Metric.
     * @param {MetricUpdateArgs} args - Arguments to update one Metric.
     * @example
     * // Update one Metric
     * const metric = await prisma.metric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MetricUpdateArgs>(args: SelectSubset<T, MetricUpdateArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Metrics.
     * @param {MetricDeleteManyArgs} args - Arguments to filter Metrics to delete.
     * @example
     * // Delete a few Metrics
     * const { count } = await prisma.metric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MetricDeleteManyArgs>(args?: SelectSubset<T, MetricDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Metrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Metrics
     * const metric = await prisma.metric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MetricUpdateManyArgs>(args: SelectSubset<T, MetricUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Metric.
     * @param {MetricUpsertArgs} args - Arguments to update or create a Metric.
     * @example
     * // Update or create a Metric
     * const metric = await prisma.metric.upsert({
     *   create: {
     *     // ... data to create a Metric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Metric we want to update
     *   }
     * })
     */
    upsert<T extends MetricUpsertArgs>(args: SelectSubset<T, MetricUpsertArgs<ExtArgs>>): Prisma__MetricClient<$Result.GetResult<Prisma.$MetricPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Metrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricCountArgs} args - Arguments to filter Metrics to count.
     * @example
     * // Count the number of Metrics
     * const count = await prisma.metric.count({
     *   where: {
     *     // ... the filter for the Metrics we want to count
     *   }
     * })
    **/
    count<T extends MetricCountArgs>(
      args?: Subset<T, MetricCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MetricCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Metric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MetricAggregateArgs>(args: Subset<T, MetricAggregateArgs>): Prisma.PrismaPromise<GetMetricAggregateType<T>>

    /**
     * Group by Metric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetricGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MetricGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MetricGroupByArgs['orderBy'] }
        : { orderBy?: MetricGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MetricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMetricGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Metric model
   */
  readonly fields: MetricFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Metric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MetricClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Metric model
   */
  interface MetricFieldRefs {
    readonly id: FieldRef<"Metric", 'Int'>
    readonly websiteId: FieldRef<"Metric", 'BigInt'>
    readonly url: FieldRef<"Metric", 'String'>
    readonly name: FieldRef<"Metric", 'String'>
    readonly timestamp: FieldRef<"Metric", 'DateTime'>
    readonly status: FieldRef<"Metric", 'String'>
    readonly responseTime: FieldRef<"Metric", 'Int'>
    readonly sslStatus: FieldRef<"Metric", 'String'>
    readonly sslExpiryDate: FieldRef<"Metric", 'DateTime'>
    readonly sslDaysRemaining: FieldRef<"Metric", 'Int'>
    readonly sslWarning: FieldRef<"Metric", 'Boolean'>
    readonly domainExpiryDate: FieldRef<"Metric", 'DateTime'>
    readonly domainDaysRemaining: FieldRef<"Metric", 'Int'>
    readonly domainWarning: FieldRef<"Metric", 'Boolean'>
    readonly safeBrowsingStatus: FieldRef<"Metric", 'String'>
    readonly malwareStatus: FieldRef<"Metric", 'String'>
    readonly phishingStatus: FieldRef<"Metric", 'String'>
    readonly blacklistStatus: FieldRef<"Metric", 'String'>
    readonly screenshotPath: FieldRef<"Metric", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Metric findUnique
   */
  export type MetricFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Filter, which Metric to fetch.
     */
    where: MetricWhereUniqueInput
  }

  /**
   * Metric findUniqueOrThrow
   */
  export type MetricFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Filter, which Metric to fetch.
     */
    where: MetricWhereUniqueInput
  }

  /**
   * Metric findFirst
   */
  export type MetricFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Filter, which Metric to fetch.
     */
    where?: MetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metrics to fetch.
     */
    orderBy?: MetricOrderByWithRelationInput | MetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Metrics.
     */
    cursor?: MetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Metrics.
     */
    distinct?: MetricScalarFieldEnum | MetricScalarFieldEnum[]
  }

  /**
   * Metric findFirstOrThrow
   */
  export type MetricFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Filter, which Metric to fetch.
     */
    where?: MetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metrics to fetch.
     */
    orderBy?: MetricOrderByWithRelationInput | MetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Metrics.
     */
    cursor?: MetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Metrics.
     */
    distinct?: MetricScalarFieldEnum | MetricScalarFieldEnum[]
  }

  /**
   * Metric findMany
   */
  export type MetricFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Filter, which Metrics to fetch.
     */
    where?: MetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metrics to fetch.
     */
    orderBy?: MetricOrderByWithRelationInput | MetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Metrics.
     */
    cursor?: MetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Metrics.
     */
    distinct?: MetricScalarFieldEnum | MetricScalarFieldEnum[]
  }

  /**
   * Metric create
   */
  export type MetricCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * The data needed to create a Metric.
     */
    data: XOR<MetricCreateInput, MetricUncheckedCreateInput>
  }

  /**
   * Metric createMany
   */
  export type MetricCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Metrics.
     */
    data: MetricCreateManyInput | MetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Metric update
   */
  export type MetricUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * The data needed to update a Metric.
     */
    data: XOR<MetricUpdateInput, MetricUncheckedUpdateInput>
    /**
     * Choose, which Metric to update.
     */
    where: MetricWhereUniqueInput
  }

  /**
   * Metric updateMany
   */
  export type MetricUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Metrics.
     */
    data: XOR<MetricUpdateManyMutationInput, MetricUncheckedUpdateManyInput>
    /**
     * Filter which Metrics to update
     */
    where?: MetricWhereInput
    /**
     * Limit how many Metrics to update.
     */
    limit?: number
  }

  /**
   * Metric upsert
   */
  export type MetricUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * The filter to search for the Metric to update in case it exists.
     */
    where: MetricWhereUniqueInput
    /**
     * In case the Metric found by the `where` argument doesn't exist, create a new Metric with this data.
     */
    create: XOR<MetricCreateInput, MetricUncheckedCreateInput>
    /**
     * In case the Metric was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MetricUpdateInput, MetricUncheckedUpdateInput>
  }

  /**
   * Metric delete
   */
  export type MetricDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
    /**
     * Filter which Metric to delete.
     */
    where: MetricWhereUniqueInput
  }

  /**
   * Metric deleteMany
   */
  export type MetricDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Metrics to delete
     */
    where?: MetricWhereInput
    /**
     * Limit how many Metrics to delete.
     */
    limit?: number
  }

  /**
   * Metric without action
   */
  export type MetricDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metric
     */
    select?: MetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metric
     */
    omit?: MetricOmit<ExtArgs> | null
  }


  /**
   * Model Server
   */

  export type AggregateServer = {
    _count: ServerCountAggregateOutputType | null
    _avg: ServerAvgAggregateOutputType | null
    _sum: ServerSumAggregateOutputType | null
    _min: ServerMinAggregateOutputType | null
    _max: ServerMaxAggregateOutputType | null
  }

  export type ServerAvgAggregateOutputType = {
    id: number | null
    port: number | null
    lastUsage: number | null
  }

  export type ServerSumAggregateOutputType = {
    id: bigint | null
    port: number | null
    lastUsage: number | null
  }

  export type ServerMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    host: string | null
    port: number | null
    username: string | null
    privateKeyPath: string | null
    lastUsage: number | null
    status: string | null
    alertSent: boolean | null
    passphrase: string | null
    lastChecked: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ServerMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    host: string | null
    port: number | null
    username: string | null
    privateKeyPath: string | null
    lastUsage: number | null
    status: string | null
    alertSent: boolean | null
    passphrase: string | null
    lastChecked: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ServerCountAggregateOutputType = {
    id: number
    name: number
    host: number
    port: number
    username: number
    privateKeyPath: number
    lastUsage: number
    status: number
    alertSent: number
    passphrase: number
    lastChecked: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ServerAvgAggregateInputType = {
    id?: true
    port?: true
    lastUsage?: true
  }

  export type ServerSumAggregateInputType = {
    id?: true
    port?: true
    lastUsage?: true
  }

  export type ServerMinAggregateInputType = {
    id?: true
    name?: true
    host?: true
    port?: true
    username?: true
    privateKeyPath?: true
    lastUsage?: true
    status?: true
    alertSent?: true
    passphrase?: true
    lastChecked?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ServerMaxAggregateInputType = {
    id?: true
    name?: true
    host?: true
    port?: true
    username?: true
    privateKeyPath?: true
    lastUsage?: true
    status?: true
    alertSent?: true
    passphrase?: true
    lastChecked?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ServerCountAggregateInputType = {
    id?: true
    name?: true
    host?: true
    port?: true
    username?: true
    privateKeyPath?: true
    lastUsage?: true
    status?: true
    alertSent?: true
    passphrase?: true
    lastChecked?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ServerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Server to aggregate.
     */
    where?: ServerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servers to fetch.
     */
    orderBy?: ServerOrderByWithRelationInput | ServerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Servers
    **/
    _count?: true | ServerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ServerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ServerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServerMaxAggregateInputType
  }

  export type GetServerAggregateType<T extends ServerAggregateArgs> = {
        [P in keyof T & keyof AggregateServer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServer[P]>
      : GetScalarType<T[P], AggregateServer[P]>
  }




  export type ServerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServerWhereInput
    orderBy?: ServerOrderByWithAggregationInput | ServerOrderByWithAggregationInput[]
    by: ServerScalarFieldEnum[] | ServerScalarFieldEnum
    having?: ServerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServerCountAggregateInputType | true
    _avg?: ServerAvgAggregateInputType
    _sum?: ServerSumAggregateInputType
    _min?: ServerMinAggregateInputType
    _max?: ServerMaxAggregateInputType
  }

  export type ServerGroupByOutputType = {
    id: bigint
    name: string
    host: string
    port: number
    username: string
    privateKeyPath: string
    lastUsage: number | null
    status: string
    alertSent: boolean
    passphrase: string | null
    lastChecked: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ServerCountAggregateOutputType | null
    _avg: ServerAvgAggregateOutputType | null
    _sum: ServerSumAggregateOutputType | null
    _min: ServerMinAggregateOutputType | null
    _max: ServerMaxAggregateOutputType | null
  }

  type GetServerGroupByPayload<T extends ServerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServerGroupByOutputType[P]>
            : GetScalarType<T[P], ServerGroupByOutputType[P]>
        }
      >
    >


  export type ServerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    host?: boolean
    port?: boolean
    username?: boolean
    privateKeyPath?: boolean
    lastUsage?: boolean
    status?: boolean
    alertSent?: boolean
    passphrase?: boolean
    lastChecked?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["server"]>



  export type ServerSelectScalar = {
    id?: boolean
    name?: boolean
    host?: boolean
    port?: boolean
    username?: boolean
    privateKeyPath?: boolean
    lastUsage?: boolean
    status?: boolean
    alertSent?: boolean
    passphrase?: boolean
    lastChecked?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ServerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "host" | "port" | "username" | "privateKeyPath" | "lastUsage" | "status" | "alertSent" | "passphrase" | "lastChecked" | "createdAt" | "updatedAt", ExtArgs["result"]["server"]>

  export type $ServerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Server"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      host: string
      port: number
      username: string
      privateKeyPath: string
      lastUsage: number | null
      status: string
      alertSent: boolean
      passphrase: string | null
      lastChecked: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["server"]>
    composites: {}
  }

  type ServerGetPayload<S extends boolean | null | undefined | ServerDefaultArgs> = $Result.GetResult<Prisma.$ServerPayload, S>

  type ServerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ServerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ServerCountAggregateInputType | true
    }

  export interface ServerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Server'], meta: { name: 'Server' } }
    /**
     * Find zero or one Server that matches the filter.
     * @param {ServerFindUniqueArgs} args - Arguments to find a Server
     * @example
     * // Get one Server
     * const server = await prisma.server.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServerFindUniqueArgs>(args: SelectSubset<T, ServerFindUniqueArgs<ExtArgs>>): Prisma__ServerClient<$Result.GetResult<Prisma.$ServerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Server that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ServerFindUniqueOrThrowArgs} args - Arguments to find a Server
     * @example
     * // Get one Server
     * const server = await prisma.server.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServerFindUniqueOrThrowArgs>(args: SelectSubset<T, ServerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServerClient<$Result.GetResult<Prisma.$ServerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Server that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerFindFirstArgs} args - Arguments to find a Server
     * @example
     * // Get one Server
     * const server = await prisma.server.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServerFindFirstArgs>(args?: SelectSubset<T, ServerFindFirstArgs<ExtArgs>>): Prisma__ServerClient<$Result.GetResult<Prisma.$ServerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Server that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerFindFirstOrThrowArgs} args - Arguments to find a Server
     * @example
     * // Get one Server
     * const server = await prisma.server.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServerFindFirstOrThrowArgs>(args?: SelectSubset<T, ServerFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServerClient<$Result.GetResult<Prisma.$ServerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Servers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Servers
     * const servers = await prisma.server.findMany()
     * 
     * // Get first 10 Servers
     * const servers = await prisma.server.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const serverWithIdOnly = await prisma.server.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServerFindManyArgs>(args?: SelectSubset<T, ServerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Server.
     * @param {ServerCreateArgs} args - Arguments to create a Server.
     * @example
     * // Create one Server
     * const Server = await prisma.server.create({
     *   data: {
     *     // ... data to create a Server
     *   }
     * })
     * 
     */
    create<T extends ServerCreateArgs>(args: SelectSubset<T, ServerCreateArgs<ExtArgs>>): Prisma__ServerClient<$Result.GetResult<Prisma.$ServerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Servers.
     * @param {ServerCreateManyArgs} args - Arguments to create many Servers.
     * @example
     * // Create many Servers
     * const server = await prisma.server.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServerCreateManyArgs>(args?: SelectSubset<T, ServerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Server.
     * @param {ServerDeleteArgs} args - Arguments to delete one Server.
     * @example
     * // Delete one Server
     * const Server = await prisma.server.delete({
     *   where: {
     *     // ... filter to delete one Server
     *   }
     * })
     * 
     */
    delete<T extends ServerDeleteArgs>(args: SelectSubset<T, ServerDeleteArgs<ExtArgs>>): Prisma__ServerClient<$Result.GetResult<Prisma.$ServerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Server.
     * @param {ServerUpdateArgs} args - Arguments to update one Server.
     * @example
     * // Update one Server
     * const server = await prisma.server.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServerUpdateArgs>(args: SelectSubset<T, ServerUpdateArgs<ExtArgs>>): Prisma__ServerClient<$Result.GetResult<Prisma.$ServerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Servers.
     * @param {ServerDeleteManyArgs} args - Arguments to filter Servers to delete.
     * @example
     * // Delete a few Servers
     * const { count } = await prisma.server.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServerDeleteManyArgs>(args?: SelectSubset<T, ServerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Servers
     * const server = await prisma.server.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServerUpdateManyArgs>(args: SelectSubset<T, ServerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Server.
     * @param {ServerUpsertArgs} args - Arguments to update or create a Server.
     * @example
     * // Update or create a Server
     * const server = await prisma.server.upsert({
     *   create: {
     *     // ... data to create a Server
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Server we want to update
     *   }
     * })
     */
    upsert<T extends ServerUpsertArgs>(args: SelectSubset<T, ServerUpsertArgs<ExtArgs>>): Prisma__ServerClient<$Result.GetResult<Prisma.$ServerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Servers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerCountArgs} args - Arguments to filter Servers to count.
     * @example
     * // Count the number of Servers
     * const count = await prisma.server.count({
     *   where: {
     *     // ... the filter for the Servers we want to count
     *   }
     * })
    **/
    count<T extends ServerCountArgs>(
      args?: Subset<T, ServerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Server.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServerAggregateArgs>(args: Subset<T, ServerAggregateArgs>): Prisma.PrismaPromise<GetServerAggregateType<T>>

    /**
     * Group by Server.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServerGroupByArgs['orderBy'] }
        : { orderBy?: ServerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Server model
   */
  readonly fields: ServerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Server.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Server model
   */
  interface ServerFieldRefs {
    readonly id: FieldRef<"Server", 'BigInt'>
    readonly name: FieldRef<"Server", 'String'>
    readonly host: FieldRef<"Server", 'String'>
    readonly port: FieldRef<"Server", 'Int'>
    readonly username: FieldRef<"Server", 'String'>
    readonly privateKeyPath: FieldRef<"Server", 'String'>
    readonly lastUsage: FieldRef<"Server", 'Int'>
    readonly status: FieldRef<"Server", 'String'>
    readonly alertSent: FieldRef<"Server", 'Boolean'>
    readonly passphrase: FieldRef<"Server", 'String'>
    readonly lastChecked: FieldRef<"Server", 'DateTime'>
    readonly createdAt: FieldRef<"Server", 'DateTime'>
    readonly updatedAt: FieldRef<"Server", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Server findUnique
   */
  export type ServerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Server
     */
    select?: ServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Server
     */
    omit?: ServerOmit<ExtArgs> | null
    /**
     * Filter, which Server to fetch.
     */
    where: ServerWhereUniqueInput
  }

  /**
   * Server findUniqueOrThrow
   */
  export type ServerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Server
     */
    select?: ServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Server
     */
    omit?: ServerOmit<ExtArgs> | null
    /**
     * Filter, which Server to fetch.
     */
    where: ServerWhereUniqueInput
  }

  /**
   * Server findFirst
   */
  export type ServerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Server
     */
    select?: ServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Server
     */
    omit?: ServerOmit<ExtArgs> | null
    /**
     * Filter, which Server to fetch.
     */
    where?: ServerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servers to fetch.
     */
    orderBy?: ServerOrderByWithRelationInput | ServerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Servers.
     */
    cursor?: ServerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servers.
     */
    distinct?: ServerScalarFieldEnum | ServerScalarFieldEnum[]
  }

  /**
   * Server findFirstOrThrow
   */
  export type ServerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Server
     */
    select?: ServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Server
     */
    omit?: ServerOmit<ExtArgs> | null
    /**
     * Filter, which Server to fetch.
     */
    where?: ServerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servers to fetch.
     */
    orderBy?: ServerOrderByWithRelationInput | ServerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Servers.
     */
    cursor?: ServerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servers.
     */
    distinct?: ServerScalarFieldEnum | ServerScalarFieldEnum[]
  }

  /**
   * Server findMany
   */
  export type ServerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Server
     */
    select?: ServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Server
     */
    omit?: ServerOmit<ExtArgs> | null
    /**
     * Filter, which Servers to fetch.
     */
    where?: ServerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servers to fetch.
     */
    orderBy?: ServerOrderByWithRelationInput | ServerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Servers.
     */
    cursor?: ServerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servers.
     */
    distinct?: ServerScalarFieldEnum | ServerScalarFieldEnum[]
  }

  /**
   * Server create
   */
  export type ServerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Server
     */
    select?: ServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Server
     */
    omit?: ServerOmit<ExtArgs> | null
    /**
     * The data needed to create a Server.
     */
    data: XOR<ServerCreateInput, ServerUncheckedCreateInput>
  }

  /**
   * Server createMany
   */
  export type ServerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Servers.
     */
    data: ServerCreateManyInput | ServerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Server update
   */
  export type ServerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Server
     */
    select?: ServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Server
     */
    omit?: ServerOmit<ExtArgs> | null
    /**
     * The data needed to update a Server.
     */
    data: XOR<ServerUpdateInput, ServerUncheckedUpdateInput>
    /**
     * Choose, which Server to update.
     */
    where: ServerWhereUniqueInput
  }

  /**
   * Server updateMany
   */
  export type ServerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Servers.
     */
    data: XOR<ServerUpdateManyMutationInput, ServerUncheckedUpdateManyInput>
    /**
     * Filter which Servers to update
     */
    where?: ServerWhereInput
    /**
     * Limit how many Servers to update.
     */
    limit?: number
  }

  /**
   * Server upsert
   */
  export type ServerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Server
     */
    select?: ServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Server
     */
    omit?: ServerOmit<ExtArgs> | null
    /**
     * The filter to search for the Server to update in case it exists.
     */
    where: ServerWhereUniqueInput
    /**
     * In case the Server found by the `where` argument doesn't exist, create a new Server with this data.
     */
    create: XOR<ServerCreateInput, ServerUncheckedCreateInput>
    /**
     * In case the Server was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServerUpdateInput, ServerUncheckedUpdateInput>
  }

  /**
   * Server delete
   */
  export type ServerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Server
     */
    select?: ServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Server
     */
    omit?: ServerOmit<ExtArgs> | null
    /**
     * Filter which Server to delete.
     */
    where: ServerWhereUniqueInput
  }

  /**
   * Server deleteMany
   */
  export type ServerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Servers to delete
     */
    where?: ServerWhereInput
    /**
     * Limit how many Servers to delete.
     */
    limit?: number
  }

  /**
   * Server without action
   */
  export type ServerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Server
     */
    select?: ServerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Server
     */
    omit?: ServerOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const WebsiteScalarFieldEnum: {
    id: 'id',
    name: 'name',
    url: 'url',
    status: 'status',
    lastStatus: 'lastStatus',
    lastCapture: 'lastCapture',
    error: 'error',
    lastCaptureImage: 'lastCaptureImage',
    alertEmail: 'alertEmail',
    emailStatus: 'emailStatus',
    lastAlertSentAt: 'lastAlertSentAt',
    domainEmailStatus: 'domainEmailStatus',
    lastDomainAlertSentAt: 'lastDomainAlertSentAt'
  };

  export type WebsiteScalarFieldEnum = (typeof WebsiteScalarFieldEnum)[keyof typeof WebsiteScalarFieldEnum]


  export const ReportScalarFieldEnum: {
    id: 'id',
    date: 'date',
    time: 'time',
    total: 'total',
    success: 'success',
    failed: 'failed',
    file: 'file'
  };

  export type ReportScalarFieldEnum = (typeof ReportScalarFieldEnum)[keyof typeof ReportScalarFieldEnum]


  export const ReportDetailScalarFieldEnum: {
    id: 'id',
    reportId: 'reportId',
    websiteId: 'websiteId',
    name: 'name',
    url: 'url',
    status: 'status',
    loadTime: 'loadTime',
    error: 'error',
    screenshot: 'screenshot'
  };

  export type ReportDetailScalarFieldEnum = (typeof ReportDetailScalarFieldEnum)[keyof typeof ReportDetailScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ScheduleScalarFieldEnum: {
    id: 'id',
    time: 'time',
    enabled: 'enabled'
  };

  export type ScheduleScalarFieldEnum = (typeof ScheduleScalarFieldEnum)[keyof typeof ScheduleScalarFieldEnum]


  export const EmailRecipientScalarFieldEnum: {
    id: 'id',
    email: 'email',
    createdAt: 'createdAt'
  };

  export type EmailRecipientScalarFieldEnum = (typeof EmailRecipientScalarFieldEnum)[keyof typeof EmailRecipientScalarFieldEnum]


  export const SmtpSettingScalarFieldEnum: {
    id: 'id',
    host: 'host',
    port: 'port',
    user: 'user',
    pass: 'pass',
    globalCcEmail: 'globalCcEmail'
  };

  export type SmtpSettingScalarFieldEnum = (typeof SmtpSettingScalarFieldEnum)[keyof typeof SmtpSettingScalarFieldEnum]


  export const SmtpConfigScalarFieldEnum: {
    id: 'id',
    host: 'host',
    port: 'port',
    username: 'username',
    password: 'password',
    globalCcEmail: 'globalCcEmail',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SmtpConfigScalarFieldEnum = (typeof SmtpConfigScalarFieldEnum)[keyof typeof SmtpConfigScalarFieldEnum]


  export const ScanExecutionLogScalarFieldEnum: {
    id: 'id',
    scheduleTime: 'scheduleTime',
    executedAt: 'executedAt',
    status: 'status',
    message: 'message'
  };

  export type ScanExecutionLogScalarFieldEnum = (typeof ScanExecutionLogScalarFieldEnum)[keyof typeof ScanExecutionLogScalarFieldEnum]


  export const MetricScalarFieldEnum: {
    id: 'id',
    websiteId: 'websiteId',
    url: 'url',
    name: 'name',
    timestamp: 'timestamp',
    status: 'status',
    responseTime: 'responseTime',
    sslStatus: 'sslStatus',
    sslExpiryDate: 'sslExpiryDate',
    sslDaysRemaining: 'sslDaysRemaining',
    sslWarning: 'sslWarning',
    domainExpiryDate: 'domainExpiryDate',
    domainDaysRemaining: 'domainDaysRemaining',
    domainWarning: 'domainWarning',
    safeBrowsingStatus: 'safeBrowsingStatus',
    malwareStatus: 'malwareStatus',
    phishingStatus: 'phishingStatus',
    blacklistStatus: 'blacklistStatus',
    screenshotPath: 'screenshotPath'
  };

  export type MetricScalarFieldEnum = (typeof MetricScalarFieldEnum)[keyof typeof MetricScalarFieldEnum]


  export const ServerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    host: 'host',
    port: 'port',
    username: 'username',
    privateKeyPath: 'privateKeyPath',
    lastUsage: 'lastUsage',
    status: 'status',
    alertSent: 'alertSent',
    passphrase: 'passphrase',
    lastChecked: 'lastChecked',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ServerScalarFieldEnum = (typeof ServerScalarFieldEnum)[keyof typeof ServerScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const WebsiteOrderByRelevanceFieldEnum: {
    name: 'name',
    url: 'url',
    status: 'status',
    lastStatus: 'lastStatus',
    lastCapture: 'lastCapture',
    error: 'error',
    lastCaptureImage: 'lastCaptureImage',
    alertEmail: 'alertEmail',
    emailStatus: 'emailStatus',
    domainEmailStatus: 'domainEmailStatus'
  };

  export type WebsiteOrderByRelevanceFieldEnum = (typeof WebsiteOrderByRelevanceFieldEnum)[keyof typeof WebsiteOrderByRelevanceFieldEnum]


  export const ReportOrderByRelevanceFieldEnum: {
    date: 'date',
    time: 'time',
    file: 'file'
  };

  export type ReportOrderByRelevanceFieldEnum = (typeof ReportOrderByRelevanceFieldEnum)[keyof typeof ReportOrderByRelevanceFieldEnum]


  export const ReportDetailOrderByRelevanceFieldEnum: {
    name: 'name',
    url: 'url',
    status: 'status',
    error: 'error',
    screenshot: 'screenshot'
  };

  export type ReportDetailOrderByRelevanceFieldEnum = (typeof ReportDetailOrderByRelevanceFieldEnum)[keyof typeof ReportDetailOrderByRelevanceFieldEnum]


  export const UserOrderByRelevanceFieldEnum: {
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    status: 'status'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const ScheduleOrderByRelevanceFieldEnum: {
    time: 'time'
  };

  export type ScheduleOrderByRelevanceFieldEnum = (typeof ScheduleOrderByRelevanceFieldEnum)[keyof typeof ScheduleOrderByRelevanceFieldEnum]


  export const EmailRecipientOrderByRelevanceFieldEnum: {
    email: 'email'
  };

  export type EmailRecipientOrderByRelevanceFieldEnum = (typeof EmailRecipientOrderByRelevanceFieldEnum)[keyof typeof EmailRecipientOrderByRelevanceFieldEnum]


  export const SmtpSettingOrderByRelevanceFieldEnum: {
    host: 'host',
    port: 'port',
    user: 'user',
    pass: 'pass',
    globalCcEmail: 'globalCcEmail'
  };

  export type SmtpSettingOrderByRelevanceFieldEnum = (typeof SmtpSettingOrderByRelevanceFieldEnum)[keyof typeof SmtpSettingOrderByRelevanceFieldEnum]


  export const SmtpConfigOrderByRelevanceFieldEnum: {
    host: 'host',
    username: 'username',
    password: 'password',
    globalCcEmail: 'globalCcEmail'
  };

  export type SmtpConfigOrderByRelevanceFieldEnum = (typeof SmtpConfigOrderByRelevanceFieldEnum)[keyof typeof SmtpConfigOrderByRelevanceFieldEnum]


  export const ScanExecutionLogOrderByRelevanceFieldEnum: {
    scheduleTime: 'scheduleTime',
    status: 'status',
    message: 'message'
  };

  export type ScanExecutionLogOrderByRelevanceFieldEnum = (typeof ScanExecutionLogOrderByRelevanceFieldEnum)[keyof typeof ScanExecutionLogOrderByRelevanceFieldEnum]


  export const MetricOrderByRelevanceFieldEnum: {
    url: 'url',
    name: 'name',
    status: 'status',
    sslStatus: 'sslStatus',
    safeBrowsingStatus: 'safeBrowsingStatus',
    malwareStatus: 'malwareStatus',
    phishingStatus: 'phishingStatus',
    blacklistStatus: 'blacklistStatus',
    screenshotPath: 'screenshotPath'
  };

  export type MetricOrderByRelevanceFieldEnum = (typeof MetricOrderByRelevanceFieldEnum)[keyof typeof MetricOrderByRelevanceFieldEnum]


  export const ServerOrderByRelevanceFieldEnum: {
    name: 'name',
    host: 'host',
    username: 'username',
    privateKeyPath: 'privateKeyPath',
    status: 'status',
    passphrase: 'passphrase'
  };

  export type ServerOrderByRelevanceFieldEnum = (typeof ServerOrderByRelevanceFieldEnum)[keyof typeof ServerOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type WebsiteWhereInput = {
    AND?: WebsiteWhereInput | WebsiteWhereInput[]
    OR?: WebsiteWhereInput[]
    NOT?: WebsiteWhereInput | WebsiteWhereInput[]
    id?: BigIntFilter<"Website"> | bigint | number
    name?: StringFilter<"Website"> | string
    url?: StringFilter<"Website"> | string
    status?: StringFilter<"Website"> | string
    lastStatus?: StringNullableFilter<"Website"> | string | null
    lastCapture?: StringNullableFilter<"Website"> | string | null
    error?: StringNullableFilter<"Website"> | string | null
    lastCaptureImage?: StringNullableFilter<"Website"> | string | null
    alertEmail?: StringNullableFilter<"Website"> | string | null
    emailStatus?: StringNullableFilter<"Website"> | string | null
    lastAlertSentAt?: DateTimeNullableFilter<"Website"> | Date | string | null
    domainEmailStatus?: StringNullableFilter<"Website"> | string | null
    lastDomainAlertSentAt?: DateTimeNullableFilter<"Website"> | Date | string | null
  }

  export type WebsiteOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    status?: SortOrder
    lastStatus?: SortOrderInput | SortOrder
    lastCapture?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    lastCaptureImage?: SortOrderInput | SortOrder
    alertEmail?: SortOrderInput | SortOrder
    emailStatus?: SortOrderInput | SortOrder
    lastAlertSentAt?: SortOrderInput | SortOrder
    domainEmailStatus?: SortOrderInput | SortOrder
    lastDomainAlertSentAt?: SortOrderInput | SortOrder
    _relevance?: WebsiteOrderByRelevanceInput
  }

  export type WebsiteWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: WebsiteWhereInput | WebsiteWhereInput[]
    OR?: WebsiteWhereInput[]
    NOT?: WebsiteWhereInput | WebsiteWhereInput[]
    name?: StringFilter<"Website"> | string
    url?: StringFilter<"Website"> | string
    status?: StringFilter<"Website"> | string
    lastStatus?: StringNullableFilter<"Website"> | string | null
    lastCapture?: StringNullableFilter<"Website"> | string | null
    error?: StringNullableFilter<"Website"> | string | null
    lastCaptureImage?: StringNullableFilter<"Website"> | string | null
    alertEmail?: StringNullableFilter<"Website"> | string | null
    emailStatus?: StringNullableFilter<"Website"> | string | null
    lastAlertSentAt?: DateTimeNullableFilter<"Website"> | Date | string | null
    domainEmailStatus?: StringNullableFilter<"Website"> | string | null
    lastDomainAlertSentAt?: DateTimeNullableFilter<"Website"> | Date | string | null
  }, "id">

  export type WebsiteOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    status?: SortOrder
    lastStatus?: SortOrderInput | SortOrder
    lastCapture?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    lastCaptureImage?: SortOrderInput | SortOrder
    alertEmail?: SortOrderInput | SortOrder
    emailStatus?: SortOrderInput | SortOrder
    lastAlertSentAt?: SortOrderInput | SortOrder
    domainEmailStatus?: SortOrderInput | SortOrder
    lastDomainAlertSentAt?: SortOrderInput | SortOrder
    _count?: WebsiteCountOrderByAggregateInput
    _avg?: WebsiteAvgOrderByAggregateInput
    _max?: WebsiteMaxOrderByAggregateInput
    _min?: WebsiteMinOrderByAggregateInput
    _sum?: WebsiteSumOrderByAggregateInput
  }

  export type WebsiteScalarWhereWithAggregatesInput = {
    AND?: WebsiteScalarWhereWithAggregatesInput | WebsiteScalarWhereWithAggregatesInput[]
    OR?: WebsiteScalarWhereWithAggregatesInput[]
    NOT?: WebsiteScalarWhereWithAggregatesInput | WebsiteScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Website"> | bigint | number
    name?: StringWithAggregatesFilter<"Website"> | string
    url?: StringWithAggregatesFilter<"Website"> | string
    status?: StringWithAggregatesFilter<"Website"> | string
    lastStatus?: StringNullableWithAggregatesFilter<"Website"> | string | null
    lastCapture?: StringNullableWithAggregatesFilter<"Website"> | string | null
    error?: StringNullableWithAggregatesFilter<"Website"> | string | null
    lastCaptureImage?: StringNullableWithAggregatesFilter<"Website"> | string | null
    alertEmail?: StringNullableWithAggregatesFilter<"Website"> | string | null
    emailStatus?: StringNullableWithAggregatesFilter<"Website"> | string | null
    lastAlertSentAt?: DateTimeNullableWithAggregatesFilter<"Website"> | Date | string | null
    domainEmailStatus?: StringNullableWithAggregatesFilter<"Website"> | string | null
    lastDomainAlertSentAt?: DateTimeNullableWithAggregatesFilter<"Website"> | Date | string | null
  }

  export type ReportWhereInput = {
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    id?: BigIntFilter<"Report"> | bigint | number
    date?: StringFilter<"Report"> | string
    time?: StringFilter<"Report"> | string
    total?: IntFilter<"Report"> | number
    success?: IntFilter<"Report"> | number
    failed?: IntFilter<"Report"> | number
    file?: StringFilter<"Report"> | string
    details?: ReportDetailListRelationFilter
  }

  export type ReportOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    time?: SortOrder
    total?: SortOrder
    success?: SortOrder
    failed?: SortOrder
    file?: SortOrder
    details?: ReportDetailOrderByRelationAggregateInput
    _relevance?: ReportOrderByRelevanceInput
  }

  export type ReportWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    date?: StringFilter<"Report"> | string
    time?: StringFilter<"Report"> | string
    total?: IntFilter<"Report"> | number
    success?: IntFilter<"Report"> | number
    failed?: IntFilter<"Report"> | number
    file?: StringFilter<"Report"> | string
    details?: ReportDetailListRelationFilter
  }, "id">

  export type ReportOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    time?: SortOrder
    total?: SortOrder
    success?: SortOrder
    failed?: SortOrder
    file?: SortOrder
    _count?: ReportCountOrderByAggregateInput
    _avg?: ReportAvgOrderByAggregateInput
    _max?: ReportMaxOrderByAggregateInput
    _min?: ReportMinOrderByAggregateInput
    _sum?: ReportSumOrderByAggregateInput
  }

  export type ReportScalarWhereWithAggregatesInput = {
    AND?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    OR?: ReportScalarWhereWithAggregatesInput[]
    NOT?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Report"> | bigint | number
    date?: StringWithAggregatesFilter<"Report"> | string
    time?: StringWithAggregatesFilter<"Report"> | string
    total?: IntWithAggregatesFilter<"Report"> | number
    success?: IntWithAggregatesFilter<"Report"> | number
    failed?: IntWithAggregatesFilter<"Report"> | number
    file?: StringWithAggregatesFilter<"Report"> | string
  }

  export type ReportDetailWhereInput = {
    AND?: ReportDetailWhereInput | ReportDetailWhereInput[]
    OR?: ReportDetailWhereInput[]
    NOT?: ReportDetailWhereInput | ReportDetailWhereInput[]
    id?: IntFilter<"ReportDetail"> | number
    reportId?: BigIntFilter<"ReportDetail"> | bigint | number
    websiteId?: BigIntFilter<"ReportDetail"> | bigint | number
    name?: StringFilter<"ReportDetail"> | string
    url?: StringFilter<"ReportDetail"> | string
    status?: StringFilter<"ReportDetail"> | string
    loadTime?: IntNullableFilter<"ReportDetail"> | number | null
    error?: StringNullableFilter<"ReportDetail"> | string | null
    screenshot?: StringNullableFilter<"ReportDetail"> | string | null
    report?: XOR<ReportScalarRelationFilter, ReportWhereInput>
  }

  export type ReportDetailOrderByWithRelationInput = {
    id?: SortOrder
    reportId?: SortOrder
    websiteId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    status?: SortOrder
    loadTime?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    screenshot?: SortOrderInput | SortOrder
    report?: ReportOrderByWithRelationInput
    _relevance?: ReportDetailOrderByRelevanceInput
  }

  export type ReportDetailWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ReportDetailWhereInput | ReportDetailWhereInput[]
    OR?: ReportDetailWhereInput[]
    NOT?: ReportDetailWhereInput | ReportDetailWhereInput[]
    reportId?: BigIntFilter<"ReportDetail"> | bigint | number
    websiteId?: BigIntFilter<"ReportDetail"> | bigint | number
    name?: StringFilter<"ReportDetail"> | string
    url?: StringFilter<"ReportDetail"> | string
    status?: StringFilter<"ReportDetail"> | string
    loadTime?: IntNullableFilter<"ReportDetail"> | number | null
    error?: StringNullableFilter<"ReportDetail"> | string | null
    screenshot?: StringNullableFilter<"ReportDetail"> | string | null
    report?: XOR<ReportScalarRelationFilter, ReportWhereInput>
  }, "id">

  export type ReportDetailOrderByWithAggregationInput = {
    id?: SortOrder
    reportId?: SortOrder
    websiteId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    status?: SortOrder
    loadTime?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    screenshot?: SortOrderInput | SortOrder
    _count?: ReportDetailCountOrderByAggregateInput
    _avg?: ReportDetailAvgOrderByAggregateInput
    _max?: ReportDetailMaxOrderByAggregateInput
    _min?: ReportDetailMinOrderByAggregateInput
    _sum?: ReportDetailSumOrderByAggregateInput
  }

  export type ReportDetailScalarWhereWithAggregatesInput = {
    AND?: ReportDetailScalarWhereWithAggregatesInput | ReportDetailScalarWhereWithAggregatesInput[]
    OR?: ReportDetailScalarWhereWithAggregatesInput[]
    NOT?: ReportDetailScalarWhereWithAggregatesInput | ReportDetailScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ReportDetail"> | number
    reportId?: BigIntWithAggregatesFilter<"ReportDetail"> | bigint | number
    websiteId?: BigIntWithAggregatesFilter<"ReportDetail"> | bigint | number
    name?: StringWithAggregatesFilter<"ReportDetail"> | string
    url?: StringWithAggregatesFilter<"ReportDetail"> | string
    status?: StringWithAggregatesFilter<"ReportDetail"> | string
    loadTime?: IntNullableWithAggregatesFilter<"ReportDetail"> | number | null
    error?: StringNullableWithAggregatesFilter<"ReportDetail"> | string | null
    screenshot?: StringNullableWithAggregatesFilter<"ReportDetail"> | string | null
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: BigIntFilter<"User"> | bigint | number
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"User"> | bigint | number
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    status?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ScheduleWhereInput = {
    AND?: ScheduleWhereInput | ScheduleWhereInput[]
    OR?: ScheduleWhereInput[]
    NOT?: ScheduleWhereInput | ScheduleWhereInput[]
    id?: BigIntFilter<"Schedule"> | bigint | number
    time?: StringFilter<"Schedule"> | string
    enabled?: BoolFilter<"Schedule"> | boolean
  }

  export type ScheduleOrderByWithRelationInput = {
    id?: SortOrder
    time?: SortOrder
    enabled?: SortOrder
    _relevance?: ScheduleOrderByRelevanceInput
  }

  export type ScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: ScheduleWhereInput | ScheduleWhereInput[]
    OR?: ScheduleWhereInput[]
    NOT?: ScheduleWhereInput | ScheduleWhereInput[]
    time?: StringFilter<"Schedule"> | string
    enabled?: BoolFilter<"Schedule"> | boolean
  }, "id">

  export type ScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    time?: SortOrder
    enabled?: SortOrder
    _count?: ScheduleCountOrderByAggregateInput
    _avg?: ScheduleAvgOrderByAggregateInput
    _max?: ScheduleMaxOrderByAggregateInput
    _min?: ScheduleMinOrderByAggregateInput
    _sum?: ScheduleSumOrderByAggregateInput
  }

  export type ScheduleScalarWhereWithAggregatesInput = {
    AND?: ScheduleScalarWhereWithAggregatesInput | ScheduleScalarWhereWithAggregatesInput[]
    OR?: ScheduleScalarWhereWithAggregatesInput[]
    NOT?: ScheduleScalarWhereWithAggregatesInput | ScheduleScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Schedule"> | bigint | number
    time?: StringWithAggregatesFilter<"Schedule"> | string
    enabled?: BoolWithAggregatesFilter<"Schedule"> | boolean
  }

  export type EmailRecipientWhereInput = {
    AND?: EmailRecipientWhereInput | EmailRecipientWhereInput[]
    OR?: EmailRecipientWhereInput[]
    NOT?: EmailRecipientWhereInput | EmailRecipientWhereInput[]
    id?: IntFilter<"EmailRecipient"> | number
    email?: StringFilter<"EmailRecipient"> | string
    createdAt?: DateTimeFilter<"EmailRecipient"> | Date | string
  }

  export type EmailRecipientOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    _relevance?: EmailRecipientOrderByRelevanceInput
  }

  export type EmailRecipientWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: EmailRecipientWhereInput | EmailRecipientWhereInput[]
    OR?: EmailRecipientWhereInput[]
    NOT?: EmailRecipientWhereInput | EmailRecipientWhereInput[]
    createdAt?: DateTimeFilter<"EmailRecipient"> | Date | string
  }, "id" | "email">

  export type EmailRecipientOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    _count?: EmailRecipientCountOrderByAggregateInput
    _avg?: EmailRecipientAvgOrderByAggregateInput
    _max?: EmailRecipientMaxOrderByAggregateInput
    _min?: EmailRecipientMinOrderByAggregateInput
    _sum?: EmailRecipientSumOrderByAggregateInput
  }

  export type EmailRecipientScalarWhereWithAggregatesInput = {
    AND?: EmailRecipientScalarWhereWithAggregatesInput | EmailRecipientScalarWhereWithAggregatesInput[]
    OR?: EmailRecipientScalarWhereWithAggregatesInput[]
    NOT?: EmailRecipientScalarWhereWithAggregatesInput | EmailRecipientScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"EmailRecipient"> | number
    email?: StringWithAggregatesFilter<"EmailRecipient"> | string
    createdAt?: DateTimeWithAggregatesFilter<"EmailRecipient"> | Date | string
  }

  export type SmtpSettingWhereInput = {
    AND?: SmtpSettingWhereInput | SmtpSettingWhereInput[]
    OR?: SmtpSettingWhereInput[]
    NOT?: SmtpSettingWhereInput | SmtpSettingWhereInput[]
    id?: IntFilter<"SmtpSetting"> | number
    host?: StringNullableFilter<"SmtpSetting"> | string | null
    port?: StringNullableFilter<"SmtpSetting"> | string | null
    user?: StringNullableFilter<"SmtpSetting"> | string | null
    pass?: StringNullableFilter<"SmtpSetting"> | string | null
    globalCcEmail?: StringNullableFilter<"SmtpSetting"> | string | null
  }

  export type SmtpSettingOrderByWithRelationInput = {
    id?: SortOrder
    host?: SortOrderInput | SortOrder
    port?: SortOrderInput | SortOrder
    user?: SortOrderInput | SortOrder
    pass?: SortOrderInput | SortOrder
    globalCcEmail?: SortOrderInput | SortOrder
    _relevance?: SmtpSettingOrderByRelevanceInput
  }

  export type SmtpSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SmtpSettingWhereInput | SmtpSettingWhereInput[]
    OR?: SmtpSettingWhereInput[]
    NOT?: SmtpSettingWhereInput | SmtpSettingWhereInput[]
    host?: StringNullableFilter<"SmtpSetting"> | string | null
    port?: StringNullableFilter<"SmtpSetting"> | string | null
    user?: StringNullableFilter<"SmtpSetting"> | string | null
    pass?: StringNullableFilter<"SmtpSetting"> | string | null
    globalCcEmail?: StringNullableFilter<"SmtpSetting"> | string | null
  }, "id">

  export type SmtpSettingOrderByWithAggregationInput = {
    id?: SortOrder
    host?: SortOrderInput | SortOrder
    port?: SortOrderInput | SortOrder
    user?: SortOrderInput | SortOrder
    pass?: SortOrderInput | SortOrder
    globalCcEmail?: SortOrderInput | SortOrder
    _count?: SmtpSettingCountOrderByAggregateInput
    _avg?: SmtpSettingAvgOrderByAggregateInput
    _max?: SmtpSettingMaxOrderByAggregateInput
    _min?: SmtpSettingMinOrderByAggregateInput
    _sum?: SmtpSettingSumOrderByAggregateInput
  }

  export type SmtpSettingScalarWhereWithAggregatesInput = {
    AND?: SmtpSettingScalarWhereWithAggregatesInput | SmtpSettingScalarWhereWithAggregatesInput[]
    OR?: SmtpSettingScalarWhereWithAggregatesInput[]
    NOT?: SmtpSettingScalarWhereWithAggregatesInput | SmtpSettingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SmtpSetting"> | number
    host?: StringNullableWithAggregatesFilter<"SmtpSetting"> | string | null
    port?: StringNullableWithAggregatesFilter<"SmtpSetting"> | string | null
    user?: StringNullableWithAggregatesFilter<"SmtpSetting"> | string | null
    pass?: StringNullableWithAggregatesFilter<"SmtpSetting"> | string | null
    globalCcEmail?: StringNullableWithAggregatesFilter<"SmtpSetting"> | string | null
  }

  export type SmtpConfigWhereInput = {
    AND?: SmtpConfigWhereInput | SmtpConfigWhereInput[]
    OR?: SmtpConfigWhereInput[]
    NOT?: SmtpConfigWhereInput | SmtpConfigWhereInput[]
    id?: IntFilter<"SmtpConfig"> | number
    host?: StringFilter<"SmtpConfig"> | string
    port?: IntFilter<"SmtpConfig"> | number
    username?: StringFilter<"SmtpConfig"> | string
    password?: StringFilter<"SmtpConfig"> | string
    globalCcEmail?: StringNullableFilter<"SmtpConfig"> | string | null
    createdAt?: DateTimeFilter<"SmtpConfig"> | Date | string
    updatedAt?: DateTimeFilter<"SmtpConfig"> | Date | string
  }

  export type SmtpConfigOrderByWithRelationInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    password?: SortOrder
    globalCcEmail?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: SmtpConfigOrderByRelevanceInput
  }

  export type SmtpConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SmtpConfigWhereInput | SmtpConfigWhereInput[]
    OR?: SmtpConfigWhereInput[]
    NOT?: SmtpConfigWhereInput | SmtpConfigWhereInput[]
    host?: StringFilter<"SmtpConfig"> | string
    port?: IntFilter<"SmtpConfig"> | number
    username?: StringFilter<"SmtpConfig"> | string
    password?: StringFilter<"SmtpConfig"> | string
    globalCcEmail?: StringNullableFilter<"SmtpConfig"> | string | null
    createdAt?: DateTimeFilter<"SmtpConfig"> | Date | string
    updatedAt?: DateTimeFilter<"SmtpConfig"> | Date | string
  }, "id">

  export type SmtpConfigOrderByWithAggregationInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    password?: SortOrder
    globalCcEmail?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SmtpConfigCountOrderByAggregateInput
    _avg?: SmtpConfigAvgOrderByAggregateInput
    _max?: SmtpConfigMaxOrderByAggregateInput
    _min?: SmtpConfigMinOrderByAggregateInput
    _sum?: SmtpConfigSumOrderByAggregateInput
  }

  export type SmtpConfigScalarWhereWithAggregatesInput = {
    AND?: SmtpConfigScalarWhereWithAggregatesInput | SmtpConfigScalarWhereWithAggregatesInput[]
    OR?: SmtpConfigScalarWhereWithAggregatesInput[]
    NOT?: SmtpConfigScalarWhereWithAggregatesInput | SmtpConfigScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SmtpConfig"> | number
    host?: StringWithAggregatesFilter<"SmtpConfig"> | string
    port?: IntWithAggregatesFilter<"SmtpConfig"> | number
    username?: StringWithAggregatesFilter<"SmtpConfig"> | string
    password?: StringWithAggregatesFilter<"SmtpConfig"> | string
    globalCcEmail?: StringNullableWithAggregatesFilter<"SmtpConfig"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SmtpConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SmtpConfig"> | Date | string
  }

  export type ScanExecutionLogWhereInput = {
    AND?: ScanExecutionLogWhereInput | ScanExecutionLogWhereInput[]
    OR?: ScanExecutionLogWhereInput[]
    NOT?: ScanExecutionLogWhereInput | ScanExecutionLogWhereInput[]
    id?: IntFilter<"ScanExecutionLog"> | number
    scheduleTime?: StringFilter<"ScanExecutionLog"> | string
    executedAt?: DateTimeFilter<"ScanExecutionLog"> | Date | string
    status?: StringFilter<"ScanExecutionLog"> | string
    message?: StringFilter<"ScanExecutionLog"> | string
  }

  export type ScanExecutionLogOrderByWithRelationInput = {
    id?: SortOrder
    scheduleTime?: SortOrder
    executedAt?: SortOrder
    status?: SortOrder
    message?: SortOrder
    _relevance?: ScanExecutionLogOrderByRelevanceInput
  }

  export type ScanExecutionLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ScanExecutionLogWhereInput | ScanExecutionLogWhereInput[]
    OR?: ScanExecutionLogWhereInput[]
    NOT?: ScanExecutionLogWhereInput | ScanExecutionLogWhereInput[]
    scheduleTime?: StringFilter<"ScanExecutionLog"> | string
    executedAt?: DateTimeFilter<"ScanExecutionLog"> | Date | string
    status?: StringFilter<"ScanExecutionLog"> | string
    message?: StringFilter<"ScanExecutionLog"> | string
  }, "id">

  export type ScanExecutionLogOrderByWithAggregationInput = {
    id?: SortOrder
    scheduleTime?: SortOrder
    executedAt?: SortOrder
    status?: SortOrder
    message?: SortOrder
    _count?: ScanExecutionLogCountOrderByAggregateInput
    _avg?: ScanExecutionLogAvgOrderByAggregateInput
    _max?: ScanExecutionLogMaxOrderByAggregateInput
    _min?: ScanExecutionLogMinOrderByAggregateInput
    _sum?: ScanExecutionLogSumOrderByAggregateInput
  }

  export type ScanExecutionLogScalarWhereWithAggregatesInput = {
    AND?: ScanExecutionLogScalarWhereWithAggregatesInput | ScanExecutionLogScalarWhereWithAggregatesInput[]
    OR?: ScanExecutionLogScalarWhereWithAggregatesInput[]
    NOT?: ScanExecutionLogScalarWhereWithAggregatesInput | ScanExecutionLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ScanExecutionLog"> | number
    scheduleTime?: StringWithAggregatesFilter<"ScanExecutionLog"> | string
    executedAt?: DateTimeWithAggregatesFilter<"ScanExecutionLog"> | Date | string
    status?: StringWithAggregatesFilter<"ScanExecutionLog"> | string
    message?: StringWithAggregatesFilter<"ScanExecutionLog"> | string
  }

  export type MetricWhereInput = {
    AND?: MetricWhereInput | MetricWhereInput[]
    OR?: MetricWhereInput[]
    NOT?: MetricWhereInput | MetricWhereInput[]
    id?: IntFilter<"Metric"> | number
    websiteId?: BigIntFilter<"Metric"> | bigint | number
    url?: StringFilter<"Metric"> | string
    name?: StringFilter<"Metric"> | string
    timestamp?: DateTimeFilter<"Metric"> | Date | string
    status?: StringFilter<"Metric"> | string
    responseTime?: IntNullableFilter<"Metric"> | number | null
    sslStatus?: StringFilter<"Metric"> | string
    sslExpiryDate?: DateTimeNullableFilter<"Metric"> | Date | string | null
    sslDaysRemaining?: IntNullableFilter<"Metric"> | number | null
    sslWarning?: BoolFilter<"Metric"> | boolean
    domainExpiryDate?: DateTimeNullableFilter<"Metric"> | Date | string | null
    domainDaysRemaining?: IntNullableFilter<"Metric"> | number | null
    domainWarning?: BoolFilter<"Metric"> | boolean
    safeBrowsingStatus?: StringFilter<"Metric"> | string
    malwareStatus?: StringFilter<"Metric"> | string
    phishingStatus?: StringFilter<"Metric"> | string
    blacklistStatus?: StringFilter<"Metric"> | string
    screenshotPath?: StringNullableFilter<"Metric"> | string | null
  }

  export type MetricOrderByWithRelationInput = {
    id?: SortOrder
    websiteId?: SortOrder
    url?: SortOrder
    name?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    responseTime?: SortOrderInput | SortOrder
    sslStatus?: SortOrder
    sslExpiryDate?: SortOrderInput | SortOrder
    sslDaysRemaining?: SortOrderInput | SortOrder
    sslWarning?: SortOrder
    domainExpiryDate?: SortOrderInput | SortOrder
    domainDaysRemaining?: SortOrderInput | SortOrder
    domainWarning?: SortOrder
    safeBrowsingStatus?: SortOrder
    malwareStatus?: SortOrder
    phishingStatus?: SortOrder
    blacklistStatus?: SortOrder
    screenshotPath?: SortOrderInput | SortOrder
    _relevance?: MetricOrderByRelevanceInput
  }

  export type MetricWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MetricWhereInput | MetricWhereInput[]
    OR?: MetricWhereInput[]
    NOT?: MetricWhereInput | MetricWhereInput[]
    websiteId?: BigIntFilter<"Metric"> | bigint | number
    url?: StringFilter<"Metric"> | string
    name?: StringFilter<"Metric"> | string
    timestamp?: DateTimeFilter<"Metric"> | Date | string
    status?: StringFilter<"Metric"> | string
    responseTime?: IntNullableFilter<"Metric"> | number | null
    sslStatus?: StringFilter<"Metric"> | string
    sslExpiryDate?: DateTimeNullableFilter<"Metric"> | Date | string | null
    sslDaysRemaining?: IntNullableFilter<"Metric"> | number | null
    sslWarning?: BoolFilter<"Metric"> | boolean
    domainExpiryDate?: DateTimeNullableFilter<"Metric"> | Date | string | null
    domainDaysRemaining?: IntNullableFilter<"Metric"> | number | null
    domainWarning?: BoolFilter<"Metric"> | boolean
    safeBrowsingStatus?: StringFilter<"Metric"> | string
    malwareStatus?: StringFilter<"Metric"> | string
    phishingStatus?: StringFilter<"Metric"> | string
    blacklistStatus?: StringFilter<"Metric"> | string
    screenshotPath?: StringNullableFilter<"Metric"> | string | null
  }, "id">

  export type MetricOrderByWithAggregationInput = {
    id?: SortOrder
    websiteId?: SortOrder
    url?: SortOrder
    name?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    responseTime?: SortOrderInput | SortOrder
    sslStatus?: SortOrder
    sslExpiryDate?: SortOrderInput | SortOrder
    sslDaysRemaining?: SortOrderInput | SortOrder
    sslWarning?: SortOrder
    domainExpiryDate?: SortOrderInput | SortOrder
    domainDaysRemaining?: SortOrderInput | SortOrder
    domainWarning?: SortOrder
    safeBrowsingStatus?: SortOrder
    malwareStatus?: SortOrder
    phishingStatus?: SortOrder
    blacklistStatus?: SortOrder
    screenshotPath?: SortOrderInput | SortOrder
    _count?: MetricCountOrderByAggregateInput
    _avg?: MetricAvgOrderByAggregateInput
    _max?: MetricMaxOrderByAggregateInput
    _min?: MetricMinOrderByAggregateInput
    _sum?: MetricSumOrderByAggregateInput
  }

  export type MetricScalarWhereWithAggregatesInput = {
    AND?: MetricScalarWhereWithAggregatesInput | MetricScalarWhereWithAggregatesInput[]
    OR?: MetricScalarWhereWithAggregatesInput[]
    NOT?: MetricScalarWhereWithAggregatesInput | MetricScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Metric"> | number
    websiteId?: BigIntWithAggregatesFilter<"Metric"> | bigint | number
    url?: StringWithAggregatesFilter<"Metric"> | string
    name?: StringWithAggregatesFilter<"Metric"> | string
    timestamp?: DateTimeWithAggregatesFilter<"Metric"> | Date | string
    status?: StringWithAggregatesFilter<"Metric"> | string
    responseTime?: IntNullableWithAggregatesFilter<"Metric"> | number | null
    sslStatus?: StringWithAggregatesFilter<"Metric"> | string
    sslExpiryDate?: DateTimeNullableWithAggregatesFilter<"Metric"> | Date | string | null
    sslDaysRemaining?: IntNullableWithAggregatesFilter<"Metric"> | number | null
    sslWarning?: BoolWithAggregatesFilter<"Metric"> | boolean
    domainExpiryDate?: DateTimeNullableWithAggregatesFilter<"Metric"> | Date | string | null
    domainDaysRemaining?: IntNullableWithAggregatesFilter<"Metric"> | number | null
    domainWarning?: BoolWithAggregatesFilter<"Metric"> | boolean
    safeBrowsingStatus?: StringWithAggregatesFilter<"Metric"> | string
    malwareStatus?: StringWithAggregatesFilter<"Metric"> | string
    phishingStatus?: StringWithAggregatesFilter<"Metric"> | string
    blacklistStatus?: StringWithAggregatesFilter<"Metric"> | string
    screenshotPath?: StringNullableWithAggregatesFilter<"Metric"> | string | null
  }

  export type ServerWhereInput = {
    AND?: ServerWhereInput | ServerWhereInput[]
    OR?: ServerWhereInput[]
    NOT?: ServerWhereInput | ServerWhereInput[]
    id?: BigIntFilter<"Server"> | bigint | number
    name?: StringFilter<"Server"> | string
    host?: StringFilter<"Server"> | string
    port?: IntFilter<"Server"> | number
    username?: StringFilter<"Server"> | string
    privateKeyPath?: StringFilter<"Server"> | string
    lastUsage?: IntNullableFilter<"Server"> | number | null
    status?: StringFilter<"Server"> | string
    alertSent?: BoolFilter<"Server"> | boolean
    passphrase?: StringNullableFilter<"Server"> | string | null
    lastChecked?: DateTimeNullableFilter<"Server"> | Date | string | null
    createdAt?: DateTimeFilter<"Server"> | Date | string
    updatedAt?: DateTimeFilter<"Server"> | Date | string
  }

  export type ServerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    privateKeyPath?: SortOrder
    lastUsage?: SortOrderInput | SortOrder
    status?: SortOrder
    alertSent?: SortOrder
    passphrase?: SortOrderInput | SortOrder
    lastChecked?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: ServerOrderByRelevanceInput
  }

  export type ServerWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: ServerWhereInput | ServerWhereInput[]
    OR?: ServerWhereInput[]
    NOT?: ServerWhereInput | ServerWhereInput[]
    name?: StringFilter<"Server"> | string
    host?: StringFilter<"Server"> | string
    port?: IntFilter<"Server"> | number
    username?: StringFilter<"Server"> | string
    privateKeyPath?: StringFilter<"Server"> | string
    lastUsage?: IntNullableFilter<"Server"> | number | null
    status?: StringFilter<"Server"> | string
    alertSent?: BoolFilter<"Server"> | boolean
    passphrase?: StringNullableFilter<"Server"> | string | null
    lastChecked?: DateTimeNullableFilter<"Server"> | Date | string | null
    createdAt?: DateTimeFilter<"Server"> | Date | string
    updatedAt?: DateTimeFilter<"Server"> | Date | string
  }, "id">

  export type ServerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    privateKeyPath?: SortOrder
    lastUsage?: SortOrderInput | SortOrder
    status?: SortOrder
    alertSent?: SortOrder
    passphrase?: SortOrderInput | SortOrder
    lastChecked?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ServerCountOrderByAggregateInput
    _avg?: ServerAvgOrderByAggregateInput
    _max?: ServerMaxOrderByAggregateInput
    _min?: ServerMinOrderByAggregateInput
    _sum?: ServerSumOrderByAggregateInput
  }

  export type ServerScalarWhereWithAggregatesInput = {
    AND?: ServerScalarWhereWithAggregatesInput | ServerScalarWhereWithAggregatesInput[]
    OR?: ServerScalarWhereWithAggregatesInput[]
    NOT?: ServerScalarWhereWithAggregatesInput | ServerScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Server"> | bigint | number
    name?: StringWithAggregatesFilter<"Server"> | string
    host?: StringWithAggregatesFilter<"Server"> | string
    port?: IntWithAggregatesFilter<"Server"> | number
    username?: StringWithAggregatesFilter<"Server"> | string
    privateKeyPath?: StringWithAggregatesFilter<"Server"> | string
    lastUsage?: IntNullableWithAggregatesFilter<"Server"> | number | null
    status?: StringWithAggregatesFilter<"Server"> | string
    alertSent?: BoolWithAggregatesFilter<"Server"> | boolean
    passphrase?: StringNullableWithAggregatesFilter<"Server"> | string | null
    lastChecked?: DateTimeNullableWithAggregatesFilter<"Server"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Server"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Server"> | Date | string
  }

  export type WebsiteCreateInput = {
    id: bigint | number
    name: string
    url: string
    status?: string
    lastStatus?: string | null
    lastCapture?: string | null
    error?: string | null
    lastCaptureImage?: string | null
    alertEmail?: string | null
    emailStatus?: string | null
    lastAlertSentAt?: Date | string | null
    domainEmailStatus?: string | null
    lastDomainAlertSentAt?: Date | string | null
  }

  export type WebsiteUncheckedCreateInput = {
    id: bigint | number
    name: string
    url: string
    status?: string
    lastStatus?: string | null
    lastCapture?: string | null
    error?: string | null
    lastCaptureImage?: string | null
    alertEmail?: string | null
    emailStatus?: string | null
    lastAlertSentAt?: Date | string | null
    domainEmailStatus?: string | null
    lastDomainAlertSentAt?: Date | string | null
  }

  export type WebsiteUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCapture?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    lastCaptureImage?: NullableStringFieldUpdateOperationsInput | string | null
    alertEmail?: NullableStringFieldUpdateOperationsInput | string | null
    emailStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastAlertSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    domainEmailStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastDomainAlertSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WebsiteUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCapture?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    lastCaptureImage?: NullableStringFieldUpdateOperationsInput | string | null
    alertEmail?: NullableStringFieldUpdateOperationsInput | string | null
    emailStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastAlertSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    domainEmailStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastDomainAlertSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WebsiteCreateManyInput = {
    id: bigint | number
    name: string
    url: string
    status?: string
    lastStatus?: string | null
    lastCapture?: string | null
    error?: string | null
    lastCaptureImage?: string | null
    alertEmail?: string | null
    emailStatus?: string | null
    lastAlertSentAt?: Date | string | null
    domainEmailStatus?: string | null
    lastDomainAlertSentAt?: Date | string | null
  }

  export type WebsiteUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCapture?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    lastCaptureImage?: NullableStringFieldUpdateOperationsInput | string | null
    alertEmail?: NullableStringFieldUpdateOperationsInput | string | null
    emailStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastAlertSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    domainEmailStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastDomainAlertSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WebsiteUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastCapture?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    lastCaptureImage?: NullableStringFieldUpdateOperationsInput | string | null
    alertEmail?: NullableStringFieldUpdateOperationsInput | string | null
    emailStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastAlertSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    domainEmailStatus?: NullableStringFieldUpdateOperationsInput | string | null
    lastDomainAlertSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ReportCreateInput = {
    id: bigint | number
    date: string
    time: string
    total: number
    success: number
    failed: number
    file: string
    details?: ReportDetailCreateNestedManyWithoutReportInput
  }

  export type ReportUncheckedCreateInput = {
    id: bigint | number
    date: string
    time: string
    total: number
    success: number
    failed: number
    file: string
    details?: ReportDetailUncheckedCreateNestedManyWithoutReportInput
  }

  export type ReportUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    total?: IntFieldUpdateOperationsInput | number
    success?: IntFieldUpdateOperationsInput | number
    failed?: IntFieldUpdateOperationsInput | number
    file?: StringFieldUpdateOperationsInput | string
    details?: ReportDetailUpdateManyWithoutReportNestedInput
  }

  export type ReportUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    total?: IntFieldUpdateOperationsInput | number
    success?: IntFieldUpdateOperationsInput | number
    failed?: IntFieldUpdateOperationsInput | number
    file?: StringFieldUpdateOperationsInput | string
    details?: ReportDetailUncheckedUpdateManyWithoutReportNestedInput
  }

  export type ReportCreateManyInput = {
    id: bigint | number
    date: string
    time: string
    total: number
    success: number
    failed: number
    file: string
  }

  export type ReportUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    total?: IntFieldUpdateOperationsInput | number
    success?: IntFieldUpdateOperationsInput | number
    failed?: IntFieldUpdateOperationsInput | number
    file?: StringFieldUpdateOperationsInput | string
  }

  export type ReportUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    total?: IntFieldUpdateOperationsInput | number
    success?: IntFieldUpdateOperationsInput | number
    failed?: IntFieldUpdateOperationsInput | number
    file?: StringFieldUpdateOperationsInput | string
  }

  export type ReportDetailCreateInput = {
    websiteId: bigint | number
    name: string
    url: string
    status: string
    loadTime?: number | null
    error?: string | null
    screenshot?: string | null
    report: ReportCreateNestedOneWithoutDetailsInput
  }

  export type ReportDetailUncheckedCreateInput = {
    id?: number
    reportId: bigint | number
    websiteId: bigint | number
    name: string
    url: string
    status: string
    loadTime?: number | null
    error?: string | null
    screenshot?: string | null
  }

  export type ReportDetailUpdateInput = {
    websiteId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    loadTime?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    screenshot?: NullableStringFieldUpdateOperationsInput | string | null
    report?: ReportUpdateOneRequiredWithoutDetailsNestedInput
  }

  export type ReportDetailUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    reportId?: BigIntFieldUpdateOperationsInput | bigint | number
    websiteId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    loadTime?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    screenshot?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReportDetailCreateManyInput = {
    id?: number
    reportId: bigint | number
    websiteId: bigint | number
    name: string
    url: string
    status: string
    loadTime?: number | null
    error?: string | null
    screenshot?: string | null
  }

  export type ReportDetailUpdateManyMutationInput = {
    websiteId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    loadTime?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    screenshot?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReportDetailUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    reportId?: BigIntFieldUpdateOperationsInput | bigint | number
    websiteId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    loadTime?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    screenshot?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateInput = {
    id?: bigint | number
    name: string
    email: string
    password?: string
    role?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id?: bigint | number
    name: string
    email: string
    password?: string
    role?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: bigint | number
    name: string
    email: string
    password?: string
    role?: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduleCreateInput = {
    id: bigint | number
    time: string
    enabled?: boolean
  }

  export type ScheduleUncheckedCreateInput = {
    id: bigint | number
    time: string
    enabled?: boolean
  }

  export type ScheduleUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    time?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ScheduleUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    time?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ScheduleCreateManyInput = {
    id: bigint | number
    time: string
    enabled?: boolean
  }

  export type ScheduleUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    time?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ScheduleUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    time?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EmailRecipientCreateInput = {
    email: string
    createdAt?: Date | string
  }

  export type EmailRecipientUncheckedCreateInput = {
    id?: number
    email: string
    createdAt?: Date | string
  }

  export type EmailRecipientUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailRecipientUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailRecipientCreateManyInput = {
    id?: number
    email: string
    createdAt?: Date | string
  }

  export type EmailRecipientUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailRecipientUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SmtpSettingCreateInput = {
    id?: number
    host?: string | null
    port?: string | null
    user?: string | null
    pass?: string | null
    globalCcEmail?: string | null
  }

  export type SmtpSettingUncheckedCreateInput = {
    id?: number
    host?: string | null
    port?: string | null
    user?: string | null
    pass?: string | null
    globalCcEmail?: string | null
  }

  export type SmtpSettingUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    host?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    pass?: NullableStringFieldUpdateOperationsInput | string | null
    globalCcEmail?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SmtpSettingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    host?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    pass?: NullableStringFieldUpdateOperationsInput | string | null
    globalCcEmail?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SmtpSettingCreateManyInput = {
    id?: number
    host?: string | null
    port?: string | null
    user?: string | null
    pass?: string | null
    globalCcEmail?: string | null
  }

  export type SmtpSettingUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    host?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    pass?: NullableStringFieldUpdateOperationsInput | string | null
    globalCcEmail?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SmtpSettingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    host?: NullableStringFieldUpdateOperationsInput | string | null
    port?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    pass?: NullableStringFieldUpdateOperationsInput | string | null
    globalCcEmail?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SmtpConfigCreateInput = {
    host: string
    port: number
    username: string
    password: string
    globalCcEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SmtpConfigUncheckedCreateInput = {
    id?: number
    host: string
    port: number
    username: string
    password: string
    globalCcEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SmtpConfigUpdateInput = {
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    globalCcEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SmtpConfigUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    globalCcEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SmtpConfigCreateManyInput = {
    id?: number
    host: string
    port: number
    username: string
    password: string
    globalCcEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SmtpConfigUpdateManyMutationInput = {
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    globalCcEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SmtpConfigUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    globalCcEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScanExecutionLogCreateInput = {
    scheduleTime: string
    executedAt?: Date | string
    status: string
    message: string
  }

  export type ScanExecutionLogUncheckedCreateInput = {
    id?: number
    scheduleTime: string
    executedAt?: Date | string
    status: string
    message: string
  }

  export type ScanExecutionLogUpdateInput = {
    scheduleTime?: StringFieldUpdateOperationsInput | string
    executedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
  }

  export type ScanExecutionLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    scheduleTime?: StringFieldUpdateOperationsInput | string
    executedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
  }

  export type ScanExecutionLogCreateManyInput = {
    id?: number
    scheduleTime: string
    executedAt?: Date | string
    status: string
    message: string
  }

  export type ScanExecutionLogUpdateManyMutationInput = {
    scheduleTime?: StringFieldUpdateOperationsInput | string
    executedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
  }

  export type ScanExecutionLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    scheduleTime?: StringFieldUpdateOperationsInput | string
    executedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
  }

  export type MetricCreateInput = {
    websiteId: bigint | number
    url: string
    name: string
    timestamp?: Date | string
    status: string
    responseTime?: number | null
    sslStatus: string
    sslExpiryDate?: Date | string | null
    sslDaysRemaining?: number | null
    sslWarning?: boolean
    domainExpiryDate?: Date | string | null
    domainDaysRemaining?: number | null
    domainWarning?: boolean
    safeBrowsingStatus: string
    malwareStatus: string
    phishingStatus: string
    blacklistStatus: string
    screenshotPath?: string | null
  }

  export type MetricUncheckedCreateInput = {
    id?: number
    websiteId: bigint | number
    url: string
    name: string
    timestamp?: Date | string
    status: string
    responseTime?: number | null
    sslStatus: string
    sslExpiryDate?: Date | string | null
    sslDaysRemaining?: number | null
    sslWarning?: boolean
    domainExpiryDate?: Date | string | null
    domainDaysRemaining?: number | null
    domainWarning?: boolean
    safeBrowsingStatus: string
    malwareStatus: string
    phishingStatus: string
    blacklistStatus: string
    screenshotPath?: string | null
  }

  export type MetricUpdateInput = {
    websiteId?: BigIntFieldUpdateOperationsInput | bigint | number
    url?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    responseTime?: NullableIntFieldUpdateOperationsInput | number | null
    sslStatus?: StringFieldUpdateOperationsInput | string
    sslExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sslDaysRemaining?: NullableIntFieldUpdateOperationsInput | number | null
    sslWarning?: BoolFieldUpdateOperationsInput | boolean
    domainExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    domainDaysRemaining?: NullableIntFieldUpdateOperationsInput | number | null
    domainWarning?: BoolFieldUpdateOperationsInput | boolean
    safeBrowsingStatus?: StringFieldUpdateOperationsInput | string
    malwareStatus?: StringFieldUpdateOperationsInput | string
    phishingStatus?: StringFieldUpdateOperationsInput | string
    blacklistStatus?: StringFieldUpdateOperationsInput | string
    screenshotPath?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MetricUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    websiteId?: BigIntFieldUpdateOperationsInput | bigint | number
    url?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    responseTime?: NullableIntFieldUpdateOperationsInput | number | null
    sslStatus?: StringFieldUpdateOperationsInput | string
    sslExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sslDaysRemaining?: NullableIntFieldUpdateOperationsInput | number | null
    sslWarning?: BoolFieldUpdateOperationsInput | boolean
    domainExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    domainDaysRemaining?: NullableIntFieldUpdateOperationsInput | number | null
    domainWarning?: BoolFieldUpdateOperationsInput | boolean
    safeBrowsingStatus?: StringFieldUpdateOperationsInput | string
    malwareStatus?: StringFieldUpdateOperationsInput | string
    phishingStatus?: StringFieldUpdateOperationsInput | string
    blacklistStatus?: StringFieldUpdateOperationsInput | string
    screenshotPath?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MetricCreateManyInput = {
    id?: number
    websiteId: bigint | number
    url: string
    name: string
    timestamp?: Date | string
    status: string
    responseTime?: number | null
    sslStatus: string
    sslExpiryDate?: Date | string | null
    sslDaysRemaining?: number | null
    sslWarning?: boolean
    domainExpiryDate?: Date | string | null
    domainDaysRemaining?: number | null
    domainWarning?: boolean
    safeBrowsingStatus: string
    malwareStatus: string
    phishingStatus: string
    blacklistStatus: string
    screenshotPath?: string | null
  }

  export type MetricUpdateManyMutationInput = {
    websiteId?: BigIntFieldUpdateOperationsInput | bigint | number
    url?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    responseTime?: NullableIntFieldUpdateOperationsInput | number | null
    sslStatus?: StringFieldUpdateOperationsInput | string
    sslExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sslDaysRemaining?: NullableIntFieldUpdateOperationsInput | number | null
    sslWarning?: BoolFieldUpdateOperationsInput | boolean
    domainExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    domainDaysRemaining?: NullableIntFieldUpdateOperationsInput | number | null
    domainWarning?: BoolFieldUpdateOperationsInput | boolean
    safeBrowsingStatus?: StringFieldUpdateOperationsInput | string
    malwareStatus?: StringFieldUpdateOperationsInput | string
    phishingStatus?: StringFieldUpdateOperationsInput | string
    blacklistStatus?: StringFieldUpdateOperationsInput | string
    screenshotPath?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MetricUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    websiteId?: BigIntFieldUpdateOperationsInput | bigint | number
    url?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    responseTime?: NullableIntFieldUpdateOperationsInput | number | null
    sslStatus?: StringFieldUpdateOperationsInput | string
    sslExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sslDaysRemaining?: NullableIntFieldUpdateOperationsInput | number | null
    sslWarning?: BoolFieldUpdateOperationsInput | boolean
    domainExpiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    domainDaysRemaining?: NullableIntFieldUpdateOperationsInput | number | null
    domainWarning?: BoolFieldUpdateOperationsInput | boolean
    safeBrowsingStatus?: StringFieldUpdateOperationsInput | string
    malwareStatus?: StringFieldUpdateOperationsInput | string
    phishingStatus?: StringFieldUpdateOperationsInput | string
    blacklistStatus?: StringFieldUpdateOperationsInput | string
    screenshotPath?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ServerCreateInput = {
    id?: bigint | number
    name: string
    host: string
    port?: number
    username: string
    privateKeyPath: string
    lastUsage?: number | null
    status?: string
    alertSent?: boolean
    passphrase?: string | null
    lastChecked?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServerUncheckedCreateInput = {
    id?: bigint | number
    name: string
    host: string
    port?: number
    username: string
    privateKeyPath: string
    lastUsage?: number | null
    status?: string
    alertSent?: boolean
    passphrase?: string | null
    lastChecked?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServerUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    privateKeyPath?: StringFieldUpdateOperationsInput | string
    lastUsage?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    alertSent?: BoolFieldUpdateOperationsInput | boolean
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    lastChecked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServerUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    privateKeyPath?: StringFieldUpdateOperationsInput | string
    lastUsage?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    alertSent?: BoolFieldUpdateOperationsInput | boolean
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    lastChecked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServerCreateManyInput = {
    id?: bigint | number
    name: string
    host: string
    port?: number
    username: string
    privateKeyPath: string
    lastUsage?: number | null
    status?: string
    alertSent?: boolean
    passphrase?: string | null
    lastChecked?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServerUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    privateKeyPath?: StringFieldUpdateOperationsInput | string
    lastUsage?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    alertSent?: BoolFieldUpdateOperationsInput | boolean
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    lastChecked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServerUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    port?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    privateKeyPath?: StringFieldUpdateOperationsInput | string
    lastUsage?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    alertSent?: BoolFieldUpdateOperationsInput | boolean
    passphrase?: NullableStringFieldUpdateOperationsInput | string | null
    lastChecked?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type WebsiteOrderByRelevanceInput = {
    fields: WebsiteOrderByRelevanceFieldEnum | WebsiteOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type WebsiteCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    status?: SortOrder
    lastStatus?: SortOrder
    lastCapture?: SortOrder
    error?: SortOrder
    lastCaptureImage?: SortOrder
    alertEmail?: SortOrder
    emailStatus?: SortOrder
    lastAlertSentAt?: SortOrder
    domainEmailStatus?: SortOrder
    lastDomainAlertSentAt?: SortOrder
  }

  export type WebsiteAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type WebsiteMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    status?: SortOrder
    lastStatus?: SortOrder
    lastCapture?: SortOrder
    error?: SortOrder
    lastCaptureImage?: SortOrder
    alertEmail?: SortOrder
    emailStatus?: SortOrder
    lastAlertSentAt?: SortOrder
    domainEmailStatus?: SortOrder
    lastDomainAlertSentAt?: SortOrder
  }

  export type WebsiteMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    status?: SortOrder
    lastStatus?: SortOrder
    lastCapture?: SortOrder
    error?: SortOrder
    lastCaptureImage?: SortOrder
    alertEmail?: SortOrder
    emailStatus?: SortOrder
    lastAlertSentAt?: SortOrder
    domainEmailStatus?: SortOrder
    lastDomainAlertSentAt?: SortOrder
  }

  export type WebsiteSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ReportDetailListRelationFilter = {
    every?: ReportDetailWhereInput
    some?: ReportDetailWhereInput
    none?: ReportDetailWhereInput
  }

  export type ReportDetailOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReportOrderByRelevanceInput = {
    fields: ReportOrderByRelevanceFieldEnum | ReportOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ReportCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    time?: SortOrder
    total?: SortOrder
    success?: SortOrder
    failed?: SortOrder
    file?: SortOrder
  }

  export type ReportAvgOrderByAggregateInput = {
    id?: SortOrder
    total?: SortOrder
    success?: SortOrder
    failed?: SortOrder
  }

  export type ReportMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    time?: SortOrder
    total?: SortOrder
    success?: SortOrder
    failed?: SortOrder
    file?: SortOrder
  }

  export type ReportMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    time?: SortOrder
    total?: SortOrder
    success?: SortOrder
    failed?: SortOrder
    file?: SortOrder
  }

  export type ReportSumOrderByAggregateInput = {
    id?: SortOrder
    total?: SortOrder
    success?: SortOrder
    failed?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ReportScalarRelationFilter = {
    is?: ReportWhereInput
    isNot?: ReportWhereInput
  }

  export type ReportDetailOrderByRelevanceInput = {
    fields: ReportDetailOrderByRelevanceFieldEnum | ReportDetailOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ReportDetailCountOrderByAggregateInput = {
    id?: SortOrder
    reportId?: SortOrder
    websiteId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    status?: SortOrder
    loadTime?: SortOrder
    error?: SortOrder
    screenshot?: SortOrder
  }

  export type ReportDetailAvgOrderByAggregateInput = {
    id?: SortOrder
    reportId?: SortOrder
    websiteId?: SortOrder
    loadTime?: SortOrder
  }

  export type ReportDetailMaxOrderByAggregateInput = {
    id?: SortOrder
    reportId?: SortOrder
    websiteId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    status?: SortOrder
    loadTime?: SortOrder
    error?: SortOrder
    screenshot?: SortOrder
  }

  export type ReportDetailMinOrderByAggregateInput = {
    id?: SortOrder
    reportId?: SortOrder
    websiteId?: SortOrder
    name?: SortOrder
    url?: SortOrder
    status?: SortOrder
    loadTime?: SortOrder
    error?: SortOrder
    screenshot?: SortOrder
  }

  export type ReportDetailSumOrderByAggregateInput = {
    id?: SortOrder
    reportId?: SortOrder
    websiteId?: SortOrder
    loadTime?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ScheduleOrderByRelevanceInput = {
    fields: ScheduleOrderByRelevanceFieldEnum | ScheduleOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    enabled?: SortOrder
  }

  export type ScheduleAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    enabled?: SortOrder
  }

  export type ScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    enabled?: SortOrder
  }

  export type ScheduleSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EmailRecipientOrderByRelevanceInput = {
    fields: EmailRecipientOrderByRelevanceFieldEnum | EmailRecipientOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type EmailRecipientCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailRecipientAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EmailRecipientMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailRecipientMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
  }

  export type EmailRecipientSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SmtpSettingOrderByRelevanceInput = {
    fields: SmtpSettingOrderByRelevanceFieldEnum | SmtpSettingOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SmtpSettingCountOrderByAggregateInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    user?: SortOrder
    pass?: SortOrder
    globalCcEmail?: SortOrder
  }

  export type SmtpSettingAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SmtpSettingMaxOrderByAggregateInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    user?: SortOrder
    pass?: SortOrder
    globalCcEmail?: SortOrder
  }

  export type SmtpSettingMinOrderByAggregateInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    user?: SortOrder
    pass?: SortOrder
    globalCcEmail?: SortOrder
  }

  export type SmtpSettingSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SmtpConfigOrderByRelevanceInput = {
    fields: SmtpConfigOrderByRelevanceFieldEnum | SmtpConfigOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SmtpConfigCountOrderByAggregateInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    password?: SortOrder
    globalCcEmail?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SmtpConfigAvgOrderByAggregateInput = {
    id?: SortOrder
    port?: SortOrder
  }

  export type SmtpConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    password?: SortOrder
    globalCcEmail?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SmtpConfigMinOrderByAggregateInput = {
    id?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    password?: SortOrder
    globalCcEmail?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SmtpConfigSumOrderByAggregateInput = {
    id?: SortOrder
    port?: SortOrder
  }

  export type ScanExecutionLogOrderByRelevanceInput = {
    fields: ScanExecutionLogOrderByRelevanceFieldEnum | ScanExecutionLogOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ScanExecutionLogCountOrderByAggregateInput = {
    id?: SortOrder
    scheduleTime?: SortOrder
    executedAt?: SortOrder
    status?: SortOrder
    message?: SortOrder
  }

  export type ScanExecutionLogAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ScanExecutionLogMaxOrderByAggregateInput = {
    id?: SortOrder
    scheduleTime?: SortOrder
    executedAt?: SortOrder
    status?: SortOrder
    message?: SortOrder
  }

  export type ScanExecutionLogMinOrderByAggregateInput = {
    id?: SortOrder
    scheduleTime?: SortOrder
    executedAt?: SortOrder
    status?: SortOrder
    message?: SortOrder
  }

  export type ScanExecutionLogSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type MetricOrderByRelevanceInput = {
    fields: MetricOrderByRelevanceFieldEnum | MetricOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type MetricCountOrderByAggregateInput = {
    id?: SortOrder
    websiteId?: SortOrder
    url?: SortOrder
    name?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    responseTime?: SortOrder
    sslStatus?: SortOrder
    sslExpiryDate?: SortOrder
    sslDaysRemaining?: SortOrder
    sslWarning?: SortOrder
    domainExpiryDate?: SortOrder
    domainDaysRemaining?: SortOrder
    domainWarning?: SortOrder
    safeBrowsingStatus?: SortOrder
    malwareStatus?: SortOrder
    phishingStatus?: SortOrder
    blacklistStatus?: SortOrder
    screenshotPath?: SortOrder
  }

  export type MetricAvgOrderByAggregateInput = {
    id?: SortOrder
    websiteId?: SortOrder
    responseTime?: SortOrder
    sslDaysRemaining?: SortOrder
    domainDaysRemaining?: SortOrder
  }

  export type MetricMaxOrderByAggregateInput = {
    id?: SortOrder
    websiteId?: SortOrder
    url?: SortOrder
    name?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    responseTime?: SortOrder
    sslStatus?: SortOrder
    sslExpiryDate?: SortOrder
    sslDaysRemaining?: SortOrder
    sslWarning?: SortOrder
    domainExpiryDate?: SortOrder
    domainDaysRemaining?: SortOrder
    domainWarning?: SortOrder
    safeBrowsingStatus?: SortOrder
    malwareStatus?: SortOrder
    phishingStatus?: SortOrder
    blacklistStatus?: SortOrder
    screenshotPath?: SortOrder
  }

  export type MetricMinOrderByAggregateInput = {
    id?: SortOrder
    websiteId?: SortOrder
    url?: SortOrder
    name?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    responseTime?: SortOrder
    sslStatus?: SortOrder
    sslExpiryDate?: SortOrder
    sslDaysRemaining?: SortOrder
    sslWarning?: SortOrder
    domainExpiryDate?: SortOrder
    domainDaysRemaining?: SortOrder
    domainWarning?: SortOrder
    safeBrowsingStatus?: SortOrder
    malwareStatus?: SortOrder
    phishingStatus?: SortOrder
    blacklistStatus?: SortOrder
    screenshotPath?: SortOrder
  }

  export type MetricSumOrderByAggregateInput = {
    id?: SortOrder
    websiteId?: SortOrder
    responseTime?: SortOrder
    sslDaysRemaining?: SortOrder
    domainDaysRemaining?: SortOrder
  }

  export type ServerOrderByRelevanceInput = {
    fields: ServerOrderByRelevanceFieldEnum | ServerOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ServerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    privateKeyPath?: SortOrder
    lastUsage?: SortOrder
    status?: SortOrder
    alertSent?: SortOrder
    passphrase?: SortOrder
    lastChecked?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServerAvgOrderByAggregateInput = {
    id?: SortOrder
    port?: SortOrder
    lastUsage?: SortOrder
  }

  export type ServerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    privateKeyPath?: SortOrder
    lastUsage?: SortOrder
    status?: SortOrder
    alertSent?: SortOrder
    passphrase?: SortOrder
    lastChecked?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    host?: SortOrder
    port?: SortOrder
    username?: SortOrder
    privateKeyPath?: SortOrder
    lastUsage?: SortOrder
    status?: SortOrder
    alertSent?: SortOrder
    passphrase?: SortOrder
    lastChecked?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServerSumOrderByAggregateInput = {
    id?: SortOrder
    port?: SortOrder
    lastUsage?: SortOrder
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ReportDetailCreateNestedManyWithoutReportInput = {
    create?: XOR<ReportDetailCreateWithoutReportInput, ReportDetailUncheckedCreateWithoutReportInput> | ReportDetailCreateWithoutReportInput[] | ReportDetailUncheckedCreateWithoutReportInput[]
    connectOrCreate?: ReportDetailCreateOrConnectWithoutReportInput | ReportDetailCreateOrConnectWithoutReportInput[]
    createMany?: ReportDetailCreateManyReportInputEnvelope
    connect?: ReportDetailWhereUniqueInput | ReportDetailWhereUniqueInput[]
  }

  export type ReportDetailUncheckedCreateNestedManyWithoutReportInput = {
    create?: XOR<ReportDetailCreateWithoutReportInput, ReportDetailUncheckedCreateWithoutReportInput> | ReportDetailCreateWithoutReportInput[] | ReportDetailUncheckedCreateWithoutReportInput[]
    connectOrCreate?: ReportDetailCreateOrConnectWithoutReportInput | ReportDetailCreateOrConnectWithoutReportInput[]
    createMany?: ReportDetailCreateManyReportInputEnvelope
    connect?: ReportDetailWhereUniqueInput | ReportDetailWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ReportDetailUpdateManyWithoutReportNestedInput = {
    create?: XOR<ReportDetailCreateWithoutReportInput, ReportDetailUncheckedCreateWithoutReportInput> | ReportDetailCreateWithoutReportInput[] | ReportDetailUncheckedCreateWithoutReportInput[]
    connectOrCreate?: ReportDetailCreateOrConnectWithoutReportInput | ReportDetailCreateOrConnectWithoutReportInput[]
    upsert?: ReportDetailUpsertWithWhereUniqueWithoutReportInput | ReportDetailUpsertWithWhereUniqueWithoutReportInput[]
    createMany?: ReportDetailCreateManyReportInputEnvelope
    set?: ReportDetailWhereUniqueInput | ReportDetailWhereUniqueInput[]
    disconnect?: ReportDetailWhereUniqueInput | ReportDetailWhereUniqueInput[]
    delete?: ReportDetailWhereUniqueInput | ReportDetailWhereUniqueInput[]
    connect?: ReportDetailWhereUniqueInput | ReportDetailWhereUniqueInput[]
    update?: ReportDetailUpdateWithWhereUniqueWithoutReportInput | ReportDetailUpdateWithWhereUniqueWithoutReportInput[]
    updateMany?: ReportDetailUpdateManyWithWhereWithoutReportInput | ReportDetailUpdateManyWithWhereWithoutReportInput[]
    deleteMany?: ReportDetailScalarWhereInput | ReportDetailScalarWhereInput[]
  }

  export type ReportDetailUncheckedUpdateManyWithoutReportNestedInput = {
    create?: XOR<ReportDetailCreateWithoutReportInput, ReportDetailUncheckedCreateWithoutReportInput> | ReportDetailCreateWithoutReportInput[] | ReportDetailUncheckedCreateWithoutReportInput[]
    connectOrCreate?: ReportDetailCreateOrConnectWithoutReportInput | ReportDetailCreateOrConnectWithoutReportInput[]
    upsert?: ReportDetailUpsertWithWhereUniqueWithoutReportInput | ReportDetailUpsertWithWhereUniqueWithoutReportInput[]
    createMany?: ReportDetailCreateManyReportInputEnvelope
    set?: ReportDetailWhereUniqueInput | ReportDetailWhereUniqueInput[]
    disconnect?: ReportDetailWhereUniqueInput | ReportDetailWhereUniqueInput[]
    delete?: ReportDetailWhereUniqueInput | ReportDetailWhereUniqueInput[]
    connect?: ReportDetailWhereUniqueInput | ReportDetailWhereUniqueInput[]
    update?: ReportDetailUpdateWithWhereUniqueWithoutReportInput | ReportDetailUpdateWithWhereUniqueWithoutReportInput[]
    updateMany?: ReportDetailUpdateManyWithWhereWithoutReportInput | ReportDetailUpdateManyWithWhereWithoutReportInput[]
    deleteMany?: ReportDetailScalarWhereInput | ReportDetailScalarWhereInput[]
  }

  export type ReportCreateNestedOneWithoutDetailsInput = {
    create?: XOR<ReportCreateWithoutDetailsInput, ReportUncheckedCreateWithoutDetailsInput>
    connectOrCreate?: ReportCreateOrConnectWithoutDetailsInput
    connect?: ReportWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ReportUpdateOneRequiredWithoutDetailsNestedInput = {
    create?: XOR<ReportCreateWithoutDetailsInput, ReportUncheckedCreateWithoutDetailsInput>
    connectOrCreate?: ReportCreateOrConnectWithoutDetailsInput
    upsert?: ReportUpsertWithoutDetailsInput
    connect?: ReportWhereUniqueInput
    update?: XOR<XOR<ReportUpdateToOneWithWhereWithoutDetailsInput, ReportUpdateWithoutDetailsInput>, ReportUncheckedUpdateWithoutDetailsInput>
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ReportDetailCreateWithoutReportInput = {
    websiteId: bigint | number
    name: string
    url: string
    status: string
    loadTime?: number | null
    error?: string | null
    screenshot?: string | null
  }

  export type ReportDetailUncheckedCreateWithoutReportInput = {
    id?: number
    websiteId: bigint | number
    name: string
    url: string
    status: string
    loadTime?: number | null
    error?: string | null
    screenshot?: string | null
  }

  export type ReportDetailCreateOrConnectWithoutReportInput = {
    where: ReportDetailWhereUniqueInput
    create: XOR<ReportDetailCreateWithoutReportInput, ReportDetailUncheckedCreateWithoutReportInput>
  }

  export type ReportDetailCreateManyReportInputEnvelope = {
    data: ReportDetailCreateManyReportInput | ReportDetailCreateManyReportInput[]
    skipDuplicates?: boolean
  }

  export type ReportDetailUpsertWithWhereUniqueWithoutReportInput = {
    where: ReportDetailWhereUniqueInput
    update: XOR<ReportDetailUpdateWithoutReportInput, ReportDetailUncheckedUpdateWithoutReportInput>
    create: XOR<ReportDetailCreateWithoutReportInput, ReportDetailUncheckedCreateWithoutReportInput>
  }

  export type ReportDetailUpdateWithWhereUniqueWithoutReportInput = {
    where: ReportDetailWhereUniqueInput
    data: XOR<ReportDetailUpdateWithoutReportInput, ReportDetailUncheckedUpdateWithoutReportInput>
  }

  export type ReportDetailUpdateManyWithWhereWithoutReportInput = {
    where: ReportDetailScalarWhereInput
    data: XOR<ReportDetailUpdateManyMutationInput, ReportDetailUncheckedUpdateManyWithoutReportInput>
  }

  export type ReportDetailScalarWhereInput = {
    AND?: ReportDetailScalarWhereInput | ReportDetailScalarWhereInput[]
    OR?: ReportDetailScalarWhereInput[]
    NOT?: ReportDetailScalarWhereInput | ReportDetailScalarWhereInput[]
    id?: IntFilter<"ReportDetail"> | number
    reportId?: BigIntFilter<"ReportDetail"> | bigint | number
    websiteId?: BigIntFilter<"ReportDetail"> | bigint | number
    name?: StringFilter<"ReportDetail"> | string
    url?: StringFilter<"ReportDetail"> | string
    status?: StringFilter<"ReportDetail"> | string
    loadTime?: IntNullableFilter<"ReportDetail"> | number | null
    error?: StringNullableFilter<"ReportDetail"> | string | null
    screenshot?: StringNullableFilter<"ReportDetail"> | string | null
  }

  export type ReportCreateWithoutDetailsInput = {
    id: bigint | number
    date: string
    time: string
    total: number
    success: number
    failed: number
    file: string
  }

  export type ReportUncheckedCreateWithoutDetailsInput = {
    id: bigint | number
    date: string
    time: string
    total: number
    success: number
    failed: number
    file: string
  }

  export type ReportCreateOrConnectWithoutDetailsInput = {
    where: ReportWhereUniqueInput
    create: XOR<ReportCreateWithoutDetailsInput, ReportUncheckedCreateWithoutDetailsInput>
  }

  export type ReportUpsertWithoutDetailsInput = {
    update: XOR<ReportUpdateWithoutDetailsInput, ReportUncheckedUpdateWithoutDetailsInput>
    create: XOR<ReportCreateWithoutDetailsInput, ReportUncheckedCreateWithoutDetailsInput>
    where?: ReportWhereInput
  }

  export type ReportUpdateToOneWithWhereWithoutDetailsInput = {
    where?: ReportWhereInput
    data: XOR<ReportUpdateWithoutDetailsInput, ReportUncheckedUpdateWithoutDetailsInput>
  }

  export type ReportUpdateWithoutDetailsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    total?: IntFieldUpdateOperationsInput | number
    success?: IntFieldUpdateOperationsInput | number
    failed?: IntFieldUpdateOperationsInput | number
    file?: StringFieldUpdateOperationsInput | string
  }

  export type ReportUncheckedUpdateWithoutDetailsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    date?: StringFieldUpdateOperationsInput | string
    time?: StringFieldUpdateOperationsInput | string
    total?: IntFieldUpdateOperationsInput | number
    success?: IntFieldUpdateOperationsInput | number
    failed?: IntFieldUpdateOperationsInput | number
    file?: StringFieldUpdateOperationsInput | string
  }

  export type ReportDetailCreateManyReportInput = {
    id?: number
    websiteId: bigint | number
    name: string
    url: string
    status: string
    loadTime?: number | null
    error?: string | null
    screenshot?: string | null
  }

  export type ReportDetailUpdateWithoutReportInput = {
    websiteId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    loadTime?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    screenshot?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReportDetailUncheckedUpdateWithoutReportInput = {
    id?: IntFieldUpdateOperationsInput | number
    websiteId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    loadTime?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    screenshot?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReportDetailUncheckedUpdateManyWithoutReportInput = {
    id?: IntFieldUpdateOperationsInput | number
    websiteId?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    loadTime?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    screenshot?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}