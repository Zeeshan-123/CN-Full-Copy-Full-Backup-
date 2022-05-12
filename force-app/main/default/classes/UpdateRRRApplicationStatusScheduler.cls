global class UpdateRRRApplicationStatusScheduler implements Schedulable
{
    global void execute(SchedulableContext cnt)
    {
        Database.executeBatch(new UpdateRRRApplicationStatusBatch()); 
    }
}