﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetDriverResponse
    {
        public DriverModel CurrentDriver { get; set; }

        public GetDriverResponse()
        {
            CurrentDriver = new DriverModel();
        }

    }
}
