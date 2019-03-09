using SME.TMS.API.Interface;

namespace SME.TMS.API.Interface.Requests
{
    public class GetJournalLookupRequest
    {
        public UserModel CurrentUser { get; set; }

        public GetJournalLookupRequest()
        {
            CurrentUser = new UserModel();
        }
    }
}