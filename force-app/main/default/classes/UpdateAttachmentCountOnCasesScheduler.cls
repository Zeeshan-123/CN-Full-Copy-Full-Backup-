global class UpdateAttachmentCountOnCasesScheduler implements Schedulable
{
    global void execute(SchedulableContext cnt)
    {
        Database.executeBatch(new UpdateAttachmentCountOnCasesBatch()); 
    }
}