global class UpdateCommunityUserAccountScheduler implements Schedulable
{
    global void execute(SchedulableContext cnt)
    {
        Database.executeBatch(new UpdateCommunityUserAccountBatch()); 
    }
}