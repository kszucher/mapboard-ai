import { PrismaClient } from '../generated/client';

export class PgFunctionsService {
  constructor(private prisma: PrismaClient) {
  }

  async setupFunctions(): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
      DROP FUNCTION IF EXISTS jsonb_merge_recurse
    `);

    await this.prisma.$executeRawUnsafe(`
        create or replace function jsonb_merge_recurse(orig jsonb, delta jsonb) 
        returns jsonb as $$
            select
               jsonb_strip_nulls(
                   jsonb_object_agg(
                        coalesce(keyOrig, keyDelta),
                        case
                            when valOrig isnull then valDelta
                            when valDelta isnull then valOrig
                            when (jsonb_typeof(valOrig) <> 'object' or jsonb_typeof(valDelta) <> 'object') then valDelta
                            else jsonb_merge_recurse(valOrig, valDelta)
                        end
                    )
                )
            from jsonb_each(orig) e1(keyOrig, valOrig)
            full join jsonb_each(delta) e2(keyDelta, valDelta) on keyOrig = keyDelta
        $$
        language sql 
    `);

    await this.prisma.$executeRawUnsafe(`
      DROP FUNCTION IF EXISTS jsonb_diff_recurse
    `);

    await this.prisma.$executeRawUnsafe(`
        CREATE OR REPLACE FUNCTION jsonb_diff_recurse(val1 JSONB, val2 JSONB)
        RETURNS JSONB as $$
            DECLARE
                result JSONB;
                difference jsonb;
                v RECORD;
            BEGIN
                result = val1;
                FOR v IN SELECT * FROM jsonb_each(val2) LOOP
                        IF result -> v.key is not null
                        THEN
                            if(jsonb_typeof(v.value) ='object') then
                                difference = jsonb_diff_recurse(result->v.key, v.value);
                                if (difference = '{}'::jsonb) then
                                    result = result - v.key;
                                else
                                    result = jsonb_set(result, array[v.key], difference);
                                end if;
                            else
                                if (result -> v.key = v.value) then
                                    result = result - v.key;
                                else continue;
                                end if;
                            end if;
                        ELSE
                            result = result || jsonb_build_object(v.key, null);
                        END IF;
                    END LOOP;
                RETURN result;
            END
        $$
        language plpgsql 
    `);
  }
}
