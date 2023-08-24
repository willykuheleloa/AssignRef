using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.AppSettings
{
    public class ZoomConfig
    {
        public string ClientSecret { get; set; }
        public string ClientId { get; set; }
        public string RedirectUrl { get; set; }
        public string ReturnUrl { get; set; }

    }
}
