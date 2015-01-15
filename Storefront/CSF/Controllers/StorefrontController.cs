
namespace Sitecore.Commerce.Storefront.Controllers
{
    using Sitecore.Commerce.Contacts;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;

    public class StorefrontController : BaseController
    {
        public StorefrontController([NotNull] ContactFactory contactFactory)
            : base(contactFactory)
        {
        }

        public ActionResult Layout()
        {
            return PartialView(this.GetAbsoluteRenderingView("/shared/_layout"));
        }
    }
}